pipeline {
    agent any
    environment {
        DOCKER_HUB = "gauravsaini2311"
        IMAGE_NAME_BACKEND = "ecommerce-backend"
        IMAGE_NAME_FRONTEND = "ecommerce-frontend"
    }
    stages {

        // ---------------- Checkout ----------------
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/gaurav2311gehu/gitops-ecommerce.git',
                    credentialsId: 'github-token'
            }
        }

        // ---------------- Backend ----------------
        stage('Build & Test Backend') {
            steps {
                dir('backend') {
                    bat 'mvn clean verify' // compile + test + package
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('backend') {
                    withSonarQubeEnv('SonarQube') {
                        withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                            bat 'mvn sonar:sonar -Dsonar.login=%SONAR_TOKEN%'
                        }
                    }
                }
            }
        }

        stage('Build & Push Backend Docker Image') {
            steps {
                dir('backend') {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                        bat "docker build -t %DOCKER_HUB%/%IMAGE_NAME_BACKEND%:latest ."
                        bat "docker push %DOCKER_HUB%/%IMAGE_NAME_BACKEND%:latest"
                    }
                }
            }
        }

        // ---------------- Frontend ----------------
        stage('Install Frontend Deps') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm test -- --watchAll=false'
                }
            }
        }

        stage('Build & Push Frontend Docker Image') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                        bat "docker build -t %DOCKER_HUB%/%IMAGE_NAME_FRONTEND%:latest ."
                        bat "docker push %DOCKER_HUB%/%IMAGE_NAME_FRONTEND%:latest"
                    }
                }
            }
        }
    }
}
