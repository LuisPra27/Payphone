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
                    cp index.html app.js styles.css response.php build/
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Validando sintaxis PHP (contenedor php:cli)'
                sh 'docker run --rm --volumes-from "$HOSTNAME" -w "$WORKSPACE" php:8.2-cli php -l response.php'

                echo 'Verificando funciones clave en app.js'
                sh '''
                    for fn in renderizarCatalogo agregarAlCarrito actualizarInterfazCarrito eliminarDelCarrito renderizarBotonPayphone; do
                        grep -q "function ${fn}" app.js || { echo "Falta la funcion ${fn} en app.js"; exit 1; }
                    done
                '''

                echo 'Verificando estructura basica de index.html'
                sh 'grep -qi "<!DOCTYPE html>" index.html'
            }
        }

        stage('Deploy') {
            steps {
                echo "Desplegando build #${env.BUILD_NUMBER} (simulado)"
                sh '''
                    mkdir -p ${DEPLOY_DIR}
                    rm -rf ${DEPLOY_DIR}/current
                    cp -r build ${DEPLOY_DIR}/current
                    echo "Build #${BUILD_NUMBER} desplegado el $(date)" >> ${DEPLOY_DIR}/deploy.log
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
