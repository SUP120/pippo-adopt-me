plugins {
    id("com.android.application") version "8.7.3"
}

android {
    namespace = "com.pippome.app"
    compileSdk = 36
    defaultConfig {
        applicationId = "com.pippome.app"
        minSdk = 26
        targetSdk = 36
        versionCode = 2
        versionName = "0.1.1"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    signingConfigs {
        create("release") {
            storeFile = file("D:\\Games\\2DGame\\PuzzleGame3\\PippoMe\\release-keystore.keystore")
            storePassword = "android123"
            keyAlias = "pippo-me"
            keyPassword = "android123"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("release")
        }
    }
}