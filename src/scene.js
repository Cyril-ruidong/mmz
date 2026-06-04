import * as THREE from 'three'

export function createScene(container) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a0a2e)
  scene.fog = new THREE.Fog(0x1a0a2e, 10, 50)

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 12, 15)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.appendChild(renderer.domElement)

  const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0x00f5ff, 1, 50)
  pointLight.position.set(0, 10, 0)
  pointLight.castShadow = true
  pointLight.shadow.mapSize.width = 1024
  pointLight.shadow.mapSize.height = 1024
  scene.add(pointLight)

  const pinkLight = new THREE.PointLight(0xff2d95, 0.8, 30)
  pinkLight.position.set(-10, 5, -10)
  scene.add(pinkLight)

  createGround(scene)
  createStarfield(scene)

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  return { scene, camera, renderer }
}

function createGround(scene) {
  const groundGeometry = new THREE.PlaneGeometry(100, 100, 50, 50)
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    metalness: 0.8,
    roughness: 0.2,
    wireframe: false
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.5
  ground.receiveShadow = true
  scene.add(ground)

  const gridHelper = new THREE.GridHelper(100, 50, 0x00f5ff, 0x1a0a2e)
  gridHelper.position.y = -0.49
  gridHelper.material.opacity = 0.3
  gridHelper.material.transparent = true
  scene.add(gridHelper)
}

function createStarfield(scene) {
  const starsGeometry = new THREE.BufferGeometry()
  const starsCount = 2000
  const positions = new Float32Array(starsCount * 3)

  for (let i = 0; i < starsCount * 3; i += 3) {
    const radius = 50 + Math.random() * 100
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI

    positions[i] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i + 1] = radius * Math.cos(phi)
    positions[i + 2] = radius * Math.sin(phi) * Math.sin(theta)
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  })

  const stars = new THREE.Points(starsGeometry, starsMaterial)
  scene.add(stars)
}
