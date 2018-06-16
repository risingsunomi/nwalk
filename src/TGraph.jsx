import React, { Component } from 'react';
import './TGraph.css';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import randomColor from 'randomcolor';

class TGraph extends Component {
  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this);
    this.scene = new THREE.Scene();
    this.geometry = new THREE.BoxGeometry(200, 200, 200);
    this.material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    });
    this.mesh = new THREE.Mesh(this.geometry,this.material);
    this.scene.add(this.mesh);
    this.renderer = null;
    this.camera = null;
    this.theta = 45;
    this.phi = 60;
    this.radious = 6;

    this.width;
    this.height;

    this.onMouseDownPosition = new THREE.Vector2();


    // animation - ideas
    this.cubes = [];
    this.environment = {
      X: 0,
      y: 0,
      z: 0
    };


    this.state = {
      dataSet: ['127.0.0.1']
    }
  }

  componentDidMount() {
    console.log(window.innerHeight);

    this.width = window.innerWidth;
    // const width = 888;
    this.height = window.innerHeight;
    // const height = 480;

    console.log('width',this.width, 'height', this.height);

    // SCENE
    this.scene = new THREE.Scene();

    // CAMERA
    this.camera = new THREE.PerspectiveCamera(
      40,
      this.width / this.height,
      1,
      10000
    );

    // this.camera = new THREE.Camera(
    //   40,
    //   width / height,
    //   1,
    //   10000
    // );



    // this.camera.position.x = this.radious * Math.sin(
    //   this.theta * Math.PI / 360 ) * Math.cos(
    //     this.phi * Math.PI / 360 );
    //
    // this.camera.position.y = this.radious * Math.sin(
    //   this.phi * Math.PI / 360 );
    //
    // this.camera.position.z = this.radious * Math.cos(
    //   this.theta * Math.PI / 360 ) * Math.cos(this.phi * Math.PI / 360 );

    // this.camera.target.position.y = 200;

    this.camera.position.z = 1000;

    // RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor("#000000");
    this.renderer.setSize(this.width, this.height);
    this.mount.appendChild(this.renderer.domElement);

    // ORBITCONTROLS
    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElemen
    );

    // ONE ROOM ENVIRONMENT
    this.environment.x = 3000;
    this.environment.y = 3000;
    this.environment.z = 3000;

    // MATERIAL GENERATORS
    // CUBE
    this.generateCubes();
    this.cubes.map((v) => {
      this.scene.add(v);
    });

    this.mount.appendChild(this.renderer.domElement);

    this.controls.update();

    this.start();

    window.addEventListener("resize", this.updateDimensions);
  }

  // start animation
  start() {
    if(!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  // stop animation
  stop() {
    cancelAnimationFrame(this.frameId);
  }

  // animate cubes
  animate() {
    this.cubes.map((v, idx) => {
      this.generateCubeAnimations(v, idx);
    });

    this.frameId = window.requestAnimationFrame(this.animate);

    this.controls.update();

    this.renderScene();

  }

  // begin rendering
  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  componentWillUnmount(){
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
    window.removeEventListener("resize", this.updateDimensions);
  }

  // some fun
  generateCubes(){
    for(let i=0; i<10000; i++) {
      let sx = Math.floor(Math.random() * 18);
      let sy = Math.floor(Math.random() * 18);
      let sz = Math.floor(Math.random() * 18);
      const geometry = new THREE.BoxGeometry(sx, sy, sz);
      const material = new THREE.MeshBasicMaterial({color: randomColor()});
      const cube = new THREE.Mesh(geometry, material);

      cube.angle = Math.PI;
      cube.size = cube.scale.x + cube.scale.y + cube.scale.z;

      cube.position.x = Math.floor(
        Math.random() * (this.environment.x - cube.size));

      cube.position.y = Math.floor(
        Math.random() * (this.environment.y - cube.size));

      cube.position.z = Math.floor(
        Math.random() * (this.environment.z - cube.size));

      this.controls.update();

      console.log(cube.material);

      this.cubes.push(
        cube
      );
    }
  }

  cubeMovement(cube) {
    // using earth gravity acceleration
    // 9.8 m/s^2
    cube.position.x += Math.sin(cube.angle) * 1;
    cube.position.y -= Math.cos(cube.angle) * 0.9;
    cube.position.z += (Math.sin(cube.angle) +  Math.cos(cube.angle)) * 1.6;
  }

  cubeBounce(cube) {

    if (cube.position.x > (this.environment.x - cube.size)) {
      cube.position.x = 2 * (this.environment.x - cube.size) - cube.position.x
      cube.angle = Math.floor(Math.random() * (Math.PI*2)) - cube.angle;

    } else if (cube.position.x < cube.size) {
      cube.position.x = 2 * cube.size - cube.position.x;
      cube.angle = Math.floor(Math.random() * (Math.PI*2)) - cube.angle

    }

    if (cube.position.y > (this.environment.y - cube.size)) {
      cube.position.y = 2 * (this.environment.y - cube.size) - cube.position.y;
      cube.angle = Math.PI - cube.angle;
    } else if (cube.position.y < cube.size) {
      cube.position.y = 2 * cube.size - cube.position.y
      cube.angle = Math.floor(Math.random() * (Math.PI/2)) - cube.angle;
    }

    if (cube.position.z > (this.environment.z - cube.size)) {
      cube.position.z = 2 * (this.environment.z - cube.size) - cube.position.z;
      cube.angle = Math.PI - cube.angle;
    } else if (cube.position.z < cube.size) {
      cube.position.z = 2 * cube.size - cube.position.z
      cube.angle = Math.floor(Math.random() * (Math.PI/4)) - cube.angle;
    }
  }

  generateCubeAnimations(cube) {
    this.cubeMovement(cube);
    this.cubeBounce(cube);
    // console.log(cube.material);
    return cube;
  }

  // Change of demension by user - refresh keeping state
  updateDimensions() {
    // console.log(this.renderer);
    // this.width = window.innerWidth;
    // this.height = window.innerHeight;
    // this.camera.aspect = this.width / this.height;
    // this.camera.updateProjectionMatrix();
    // this.renderer.setSize(this.width, this.height);

    window.location.reload();
  }

  render() {
    return (
      <div
        tabIndex="0"
        className='Stage'
        ref={(mount) => { this.mount = mount }}
      />
    );
  }
}
export default TGraph;
