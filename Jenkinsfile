pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = 'docker-compose'
    }

    stages {

        stage('Clonar repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/Fernanda260504/SIGEP-ALM.git'
            }
        }

        stage('Build Backend (Spring Boot)') {
            steps {
                dir('sigepalm') {
                    sh 'chmod +x mvnw'
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend (React + Vite)') {
            steps {
                dir('sigepalm-front/permisos-frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh "${DOCKER_COMPOSE} build"
            }
        }

        stage('Deploy Containers') {
            steps {
                sh "${DOCKER_COMPOSE} down || true"
                sh "${DOCKER_COMPOSE} up -d"
            }
        }

    }

    post {
        success {
            echo '✅ SIGEP-ALM desplegado correctamente'
        }
        failure {
            echo '❌ Error en el pipeline, revisa logs'
        }
    }
}