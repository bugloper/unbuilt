# Unbuilt Specification

### Overview
Unbuilt is a Rails-inpired asset delivery pipeline. Now, what is a Rails Asset Pipeline? It is a library designed for organizing, caching, and serving static assets, such as JavaScript, CSS, and image files. It streamlines and optimizes the management of these assets to enhance the performance and maintainability of the application. Refer the official [documentation](https://guides.rubyonrails.org/asset_pipeline.html) for more details. Now, the goal of this project is to implement the Rails Asset Pipeline framework and nobuild stack in other langauges. 

**Note**: Please note that when I say "specification," it refers to a list of features the tool should have and what each feature must do. In this way, if I want to learn a new language, I just refer this spec and build this framework.

### **Core Components**

**1. Asset Management**
- Support for different asset types: JavaScript, CSS, images, fonts
- Automatic asset fingerprinting for cache busting
- Development and production asset serving mechanisms

**2. Executable Scripts**
- `bin/precompile`: it can be either a shebang executable, requiring an interpreter like Ruby, Noe, Bash, or a real binary, compiled and directly executable by the system
- Generates production-ready assets
- Creates fingerprinted asset manifests
- Supports asset compression and optimization

**3. Development Environment**
- Zero-configuration asset serving
- Live reloading/hot module replacement support
- Automatic asset transformation without explicit build steps

**4. Asset Preprocessing**
- No preprocessing supported as this is a nobuild-based asset pipeline.
  
**5. Fingerprinting System**
Generate unique hash/fingerprint for each asset
Enable long-term caching strategies
Automatic manifest generation

**6. Configuration Options**
Customizable asset paths
Include/exclude rules for asset processing
Environment-specific configurations (dev/prod)
