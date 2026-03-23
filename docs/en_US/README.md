# JetBrains License Server Help

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-17-blue.svg)](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.0-blue.svg)](https://spring.io/projects/spring-boot)

A powerful JetBrains product license server helper tool that provides license generation, validation, and server simulation functionality.

## 🌐 Language Switch

- [中文文档](../zh_CN/README.md)
- [English Documentation](README.md)

## 📖 Documentation Navigation

- [Project Overview](#project-overview)
- [Core Features](core-features.md)
- [Technology Stack](technical-architecture.md)
- [Environment Configuration](environment-configuration.md)
- [Installation and Deployment](installation-deployment.md)
- [Usage Instructions](usage-guide.md)
- [API Documentation](api-documentation.md)
- [Contributing Guide](contributing.md)
- [Frequently Asked Questions](faq.md)
- [License Information](license.md)

## ✨ Core Features

- 🎯 **License Generation**: Support for generating licenses for all JetBrains products
- 🖥️ **Server Simulation**: Compatible with JetBrains official license server protocol
- 📦 **Product Management**: Built-in complete JetBrains product and plugin information
- 🔒 **Security**: Use RSA signatures to ensure data security
- 📱 **ja-netfilter Integration**: Built-in proxy tool download and configuration
- 🎨 **Visual Interface**: Provide a friendly web management interface

## 🛠️ Technology Stack

- **Backend Framework**: Spring Boot 4.0
- **Development Language**: Java 17
- **Core Dependencies**:
  - Hutool utility library
  - Lombok code simplification
  - BouncyCastle cryptography library
  - JAXB XML processing
- **Frontend Technology**: HTML5 + CSS3 + JavaScript

## 🚀 Quick Start

### Environment Requirements

- JDK 17 or higher
- Maven 3.6 or higher (optional, for compilation)

### Running Methods

#### Method 1: Directly Run JAR Package

```bash
# Download the latest version JAR package
java -jar Jetbrains-LicenseServer-Help.jar
```

#### Method 2: Using Docker

```bash
docker run -d -p 10768:10768 --name license-server-help your-image-name
```

#### Method 3: Local Compilation and Running

```bash
# Clone the repository
git clone https://github.com/JengVend02/Jetbrains-LicenseServer-Help.git

# Enter the project directory
cd Jetbrains-LicenseServer-Help

# Compile the project
mvn clean package -DskipTests

# Run the project
java -jar target/Jetbrains-LicenseServer-Help.jar
```

## 📖 Usage Instructions

1. **Access the Management Interface**: After running the project, access `http://localhost:10768` in your browser
2. **Generate License**: Select the product type and version as needed to generate the corresponding license
3. **Configure JetBrains Product**:
   - Open JetBrains product (such as IntelliJ IDEA)
   - Select "Help" -> "Register"
   - Select "License server"
   - Enter the license server address: `http://localhost:10768`
   - Click "Activate" to complete activation

## 📝 Contributing Guide

Welcome to submit Issues and Pull Requests! Please read the [Contributing Guide](contributing.md) for more information.

## 📄 License

This project is licensed under the MIT License, see the [LICENSE](../LICENSE) file for details.

## 🤝 Support

If you encounter problems during use, please:

1. Check the [Frequently Asked Questions](faq.md)
2. Submit an [Issue](https://github.com/JengVend02/Jetbrains-LicenseServer-Help/issues)

## 🙏 Acknowledgments

Thank you to all developers and users who have contributed to this project!

---

**Note**: This project is for learning and research purposes only, please comply with JetBrains' software license agreement.
