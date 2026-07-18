pipeline {
    agent any

    triggers {
        githubPush()
    }

    tools {
        dockerTool 'DockerTool'
    }

    environment {
        DEPLOY_DIR = 'deploy_simulado'
        CONTAINER_NAME = 'payphone-app'
        HOST_PORT = '8081'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo "Preparando artefactos - build #${env.BUILD_NUMBER}"
                sh '''
                    rm -rf build
                    mkdir -p build
                    cp index.html app.js cart-calc.js styles.css response.php build/
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Validando sintaxis PHP (contenedor php:cli)'
                sh 'docker run --rm --volumes-from "$HOSTNAME" -w "$WORKSPACE" php:8.2-cli php -l response.php'

                echo 'Ejecutando pruebas unitarias de la logica del carrito (Node test runner)'
                sh 'docker run --rm --volumes-from "$HOSTNAME" -w "$WORKSPACE" node:20-alpine node --test'
            }
        }

        stage('Deploy') {
            steps {
                echo "Desplegando build #${env.BUILD_NUMBER} en contenedor Docker (puerto ${HOST_PORT})"
                sh '''
                    docker build -t payphone:latest .
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    docker run -d --name ${CONTAINER_NAME} -p ${HOST_PORT}:80 payphone:latest
                '''
            }
        }
    }

    post {
        success {
            echo "Pipeline completado correctamente (build #${env.BUILD_NUMBER})"
            archiveArtifacts artifacts: 'build/**', fingerprint: true
        }
        failure {
            echo "El pipeline fallo en el build #${env.BUILD_NUMBER}"
        }
    }
}
