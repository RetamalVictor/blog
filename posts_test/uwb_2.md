# Part .2 UWB ranging using Bi-TWR protocol implementation with C

In this blog post, we will explore a code snippet that implements Time of Flight (ToF) ranging using Ultra-Wideband (UWB) devices. The code presented here is in C and makes use of the DW1000 library for communication with UWB devices.

The full code for the implementation is [here](https://github.com/RetamalVictor/crazyflie-firmware-VU/tree/relative_loco)

The code can be divided into four main parts:

1. Initialization
2. Transmission callback
3. Reception callback
4. Event handling

This blogpost will focus on points 1 and 2.
Future blogposts will cover points 3 and 4.

## Initialization

The `twrTagInit()` function takes a pointer to a `dwDevice_t` structure, which represents the UWB device. Within the function, the device configuration is set, including communication parameters, such as channel, data rate, and preamble length. The initial state of the device is also defined, preparing it for the TWR protocol.

```c
static void twrTagInit(dwDevice_t *dev)
{
    // Initialize the packet in the TX buffer
    memset(&txPacket, 0, sizeof(txPacket));
    MAC80215_PACKET_INIT(txPacket, MAC802154_TYPE_DATA);
    txPacket.pan = 0xbccf;

    memset(&poll_tx, 0, sizeof(poll_tx));
    memset(&poll_rx, 0, sizeof(poll_rx));
    memset(&answer_tx, 0, sizeof(answer_tx));
    memset(&answer_rx, 0, sizeof(answer_rx));
    memset(&final_tx, 0, sizeof(final_tx));
    memset(&final_rx, 0, sizeof(final_rx));}
```

The `memset` function is called to initialize the packet structures to zero. These structures are used to send and receive data during the TWR protocol. The six packet structures are: `poll_tx`, `poll_rx`, `answer_tx`, `answer_rx`, `final_tx`, and `final_rx`.

The `MAC80215_PACKET_INIT` macro is called to initialize the `txPacket` structure with the type `MAC802154_TYPE_DATA`. The PAN (Personal Area Network) identifier is set to `0xbccf`, which is the default PAN ID used by the DW1000 library.

```c
    selfID = (uint8_t)(((configblockGetRadioAddress()) & 0x000000000f) - 1);
    selfAddress = options->tagAddress + selfID;

```

The device's unique ID (`selfID`) is derived from the radio address, which is used to calculate the device's address (`selfAddress`).

```c
    if (selfID==0)
    {
        current_mode_trans = true;
        current_receiveID = NumUWB-1;
        dwSetReceiveWaitTimeout(dev, 1000);
    }
    else
    {
        current_mode_trans = false;
        dwSetReceiveWaitTimeout(dev, 10000);    
    }

```

Based on the `selfID`, the device is set as either the sender (transmitter) or the receiver, with different receive wait timeouts. The first device `(selfID == 0)`is set as the sender with a receive wait timeout of 1000 milliseconds. All other devices are set as receivers with a receive wait timeout of 10000 milliseconds.

The receiver's timeout is set longer than the transmitter's timeout because the receiver needs to be available for a more extended period to ensure it captures the poll message from the transmitter. A longer timeout also helps in reducing the chance of missed poll messages due to temporary obstacles, interference, or other issues.

```c
    for (int i = 0; i < NumUWB; i++) {
        median_data[i].index_inserting = 0;
    }

```

The median_data array is initialized, setting the index_inserting field to zero for each device in the swarm.

Finally, the `checkTurn` and `rangingOk` flags are set to false, which are used to control the TWR protocol's flow.

```c
checkTurn = false;
rangingOk = false;
```

## Transmission callback

```c
static void txcallback(dwDevice_t *dev)
{
    // time measurement
    dwTime_t departure;
    dwGetTransmitTimestamp(dev, &departure);
    departure.full += (options->antennaDelay / 2);

    if (current_mode_trans) // sender mode
    {
        switch (txPacket.payload[LPS_TWR_TYPE])
        {
            case LPS_TWR_POLL:
                poll_tx = departure;
                break;
            
            case LPS_TWR_FINAL:
                final_tx = departure;
                break;
        
            case LPS_TWR_DYNAMIC:
                if( (current_receiveID == 0) || (current_receiveID-1 == selfID) ){
                        current_mode_trans = false;
                        dwIdle(dev);
                        dwSetReceiveWaitTimeout(dev, 10000);
                        dwNewReceive(dev);
                        dwSetDefaults(dev);
                        dwStartReceive(dev);
                        checkTurn = true;
                        checkTurnTick = xTaskGetTickCount();
                }
                else
                {
                        current_receiveID = current_receiveID - 1;
                }
                break;
        }
    }
    else // receiver mode
    {
        switch (txPacket.payload[LPS_TWR_TYPE])
        {
            case LPS_TWR_ANSWER:
                answer_tx = departure;
                break;
            
            case LPS_TWR_REPORT:
            break;
        }
    }
}
```

The `txcallback` function is responsible for handling actions after a packet has been transmitted, depending on the type of packet and the device's role as a sender or receiver.

Let's start by examining the structure of the function:

```c
static void txcallback(dwDevice_t *dev)
{
    // ...
}
```

The `txcallback` function takes a single argument, a pointer to the dwDevice_t structure, which represents the UWB transceiver device.

### Step 1: Timestamping the transmitted packet

The first action inside the function is to obtain a timestamp for the transmitted packet and account for the antenna delay.

```c
    // time measurement
    dwTime_t departure;
    dwGetTransmitTimestamp(dev, &departure);
    departure.full += (options->antennaDelay / 2);
```

The `dwGetTransmitTimestamp` function retrieves the transmit timestamp and stores it in the `departure` variable. The antenna delay is then divided by 2 and added to the timestamp to account for the time taken for the signal to travel from the device's antenna to the air.

### Step 2: Handling the sender mode

If the device is operating in sender mode (`current_mode_trans` is true), it can transmit three types of packets: poll, final, and dynamic.

#### Poll Packet

When a poll packet is transmitted, the departure timestamp is saved in the poll_tx variable.

```c
case LPS_TWR_POLL:
    poll_tx = departure;
    break;
```

#### Final Packet

When a final packet is transmitted, the departure timestamp is saved in the final_tx variable.

```c
case LPS_TWR_FINAL:
    final_tx = departure;
    break;
```

#### Dynamic Packet

When a dynamic packet is transmitted, the departure timestamp is saved in the answer_tx variable. The current_receiveID is then checked to determine if the device is the last device in the swarm. If it is, the device is set to receiver mode, and the receive wait timeout is set to 10000 milliseconds. The device then starts receiving and sets the checkTurn flag to true.

```c
if( (current_receiveID == 0) || (current_receiveID-1 == selfID) ){
    current_mode_trans = false;
    dwIdle(dev);
    dwSetReceiveWaitTimeout(dev, 10000);
    dwNewReceive(dev);
    dwSetDefaults(dev);
    dwStartReceive(dev);
    checkTurn = true;
    checkTurnTick = xTaskGetTickCount();
}
```

If not, it updates the current_receiveID variable to point to the previous device in the sequence.

```c
else
{
    current_receiveID = current_receiveID - 1;
}
```

### Step 3: Handling the receiver mode

If the device is operating in receiver mode (`current_mode_trans` is false), it can transmit two types of packets: answer and report.

#### Answer Packet

When an answer packet is transmitted, the departure timestamp is saved in the answer_tx variable.

```c
case LPS_TWR_ANSWER:
    answer_tx = departure;
    break;
```

#### Report Packet

When a report packet is transmitted, the departure timestamp is saved in the report_tx variable.

```c
case LPS_TWR_REPORT:
    report_tx = departure;
    break;
```

We have explored the `initialization` and `txcallback` function in-depth, which plays a crucial role in the bidirectional two-way ranging system. We have learned how it handles different packet types based on the device's role as a sender or receiver. We also discussed how the function manages the turn-taking process between devices, ensuring smooth and efficient operation.

I hope these insights will help you grasp the intricacies of implementing UWB-based distance measurements in your projects.

In our next blog post, we will dive into the complementary part of the ranging system – the `rxcallback` function and `event handling`. We will explore how the devices handle incoming packets, process the timestamps, and ultimately calculate the distances between them. Stay tuned for more in-depth explanations and examples that will expand your knowledge and help you master UWB-based ranging systems.

Happy learning!
