
import React, { Component } from 'react';
import * as THREE from 'three';
import Orbitcontrols from 'three-orbitcontrols';
import { Radio ,Button} from 'antd';
const RadioGroup = Radio.Group;
class Css13 extends Component{
	constructor(props){
        super(props);
        this.state={
			value: 'Y',
        }
    }
 	componentDidMount(){
		this.initThree();
	}
	initThree(){
		let me=this
		let camera, scene, renderer;
		let group;
		let container = document.getElementById('WebGL-output');
		let width = container.clientWidth,height = container.clientHeight;

		init();
		animate();

		function init() {
			scene = new THREE.Scene();
			group = new THREE.Group();
			scene.add( group );

			camera = new THREE.PerspectiveCamera( 60, width / height, 1, 2000 );
			camera.position.x = -10;
        	camera.position.y = 15;
			camera.position.z = 500;
			camera.lookAt( scene.position );
			
			//控制地球
			let orbitControls = new /*THREE.OrbitControls*/Orbitcontrols(camera);
        	orbitControls.autoRotate = false;
        	// let clock = new THREE.Clock();
        	//光源
        	let ambi = new THREE.AmbientLight(0x686868);
        	scene.add(ambi);

        	let spotLight = new THREE.DirectionalLight(0xffffff);
        	spotLight.position.set(550, 100, 550);
        	spotLight.intensity = 0.6;

        	scene.add(spotLight);
			// Texture
			let loader = new THREE.TextureLoader();
			let planetTexture = require("../../assets/img/b.png");//引入图片

			loader.load( planetTexture, function ( texture ) {
				let geometry = new THREE.SphereGeometry( 200, 20, 20 );
				let material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
				let mesh = new THREE.Mesh( geometry, material );
				group.add( mesh );
			} );

			renderer = new THREE.WebGLRenderer();
			renderer.setClearColor( 0xffffff );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( width, height );
			container.appendChild( renderer.domElement );

		}
		
		function animate() {
			requestAnimationFrame( animate );
			render();
		}
		function render() {	
			if(me.state.value=='X'){
				group.rotation.x -= 0.005;
			}else if(me.state.value=='Y'){
				group.rotation.y -= 0.005;  //这行可以控制地球自转
			}else if(me.state.value=='Z'){
				group.rotation.z -= 0.005;
			}else{
				group.rotation.x = 0;
				group.rotation.x = 0;
				group.rotation.x = 0;
			}
			renderer.render( scene, camera );
		}
	}
	onChange = (e) => {
		console.log('radio checked', e.target.value);
		this.setState({
		  value: e.target.value,
		});
	}
	render(){
		return(
			<div id='css13'>
				<div id='WebGL-output' style={{width:'700px',height:'700px'}}></div>
				<div className='right'>
				<RadioGroup onChange={this.onChange} value={this.state.value}>
					<Radio value={'Y'}>Y</Radio>
					<Radio value={'X'}>X</Radio>
					<Radio value={'Z'}>Z</Radio>
					<Radio value={'S'}>S</Radio>
				</RadioGroup>
				</div>
			</div>
			
		)
	}
}

export default Css13;