pipeline {
    agent any
    environment {
        DOCKER_HUB = "gauravsaini2311"
        IMAGE_NAME_BACKEND = "ecommerce-backend"
        IMAGE_NAME_FRONTEND = "ecommerce-frontend"
        KUBECONFIG = "C:\\Users\\Gaurav Saini\\.kube\\config" // Minikube kubeconfig ka path
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/gaurav2311gehu/gitops-ecommerce.git',
                    credentialsId: 'github-token'
            }
        }

        // ---------------- Backend ----------------
        stage('Build & Test Backend') {
            steps {
                dir('backend') {
                    bat 'mvn clean verify'
                }
            }
        }

        stage('Build & Push Backend Image') {
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
        stage('Build & Push Frontend Image') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                        bat "docker build -t %DOCKER_HUB%/%IMAGE_NAME_FRONTEND%:latest ."
                        bat "docker push %DOCKER_HUB%/%IMAGE_NAME_FRONTEND%:latest"
                    }
                }
            }
        }

        // ---------------- Deploy to Minikube ----------------
        stage('Deploy to Minikube') {
            steps {
                dir('kubernetes') {
                    bat 'kubectl --kubeconfig="%KUBECONFIG%" apply -f namespace.yaml || echo Namespace already exists'
                    bat 'kubectl --kubeconfig="%KUBECONFIG%" apply -f backend-deployment.yaml'
                    bat 'kubectl --kubeconfig="%KUBECONFIG%" apply -f backend-service.yaml'
                    bat 'kubectl --kubeconfig="%KUBECONFIG%" apply -f frontend-deployment.yaml'
                    bat 'kubectl --kubeconfig="%KUBECONFIG%" apply -f frontend-service.yaml'
                    bat 'kubectl --kubeconfig="%KUBECONFIG%" apply -f ingress.yaml'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Great! CI/CD completed and deployed to Minikube!'
        }
        failure {
            echo '❌ Pipeline failed! Check logs.'
        }
    }
}
