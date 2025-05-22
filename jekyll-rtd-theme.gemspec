Gem::Specification.new do |spec|
  spec.name          = "VictorRetamal"
  spec.version       = "2.0.10"
  spec.authors       = ["Victor"]
  spec.email         = ["retamal1.victor@gmail.com"]

  spec.summary       = "Take a look at my journey"
  spec.license       = "MIT"
  spec.homepage      = "https://retamalvictor.github.io/blog/"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README)!i) }

  spec.add_runtime_dependency "github-pages", "~> 209"
end
