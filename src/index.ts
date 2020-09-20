import {
  Engine,
  Scene,
  Light,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ArcRotateCamera,
  StandardMaterial,
  MaterialHelper,
  Color3,
  Node,
} from '@babylonjs/core';

import '@babylonjs/core/Debug/debugLayer'; // Augments the scene with the debug methods
import '@babylonjs/inspector'; // Injects a local ES6 version of the inspector to prevent automatically relying on the none compatible version

class Building {
  constructor(scene: Scene, parent: Node) {
    const box = MeshBuilder.CreateBox(
      'building',
      {
        size: 1,
      },
      scene
    );
    box.position.y = .5
    box.setParent(parent);
  }
}

class Game {
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _scene: Scene;
  private _camera: ArcRotateCamera;
  private _light: Light;

  constructor(canvasElementId: string) {
    // Create canvas and engine.
    this._canvas = document.getElementById(
      canvasElementId
    ) as HTMLCanvasElement;
    this._engine = new Engine(this._canvas, true);
  }

  createScene(): void {
    // Create a basic BJS Scene object.
    this._scene = new Scene(this._engine);

    this._camera = new ArcRotateCamera(
      'camera1',
      0,
      1,
      15,
      new Vector3(0, 0, 0),
      this._scene
    );

    // Target the camera to scene origin.
    this._camera.setTarget(Vector3.Zero());

    // Attach the camera to the canvas.
    this._camera.attachControl(this._canvas, false);

    this._camera.position;

    // Create a basic light, aiming 0,1,0 - meaning, to the sky.
    this._light = new HemisphericLight(
      'light1',
      new Vector3(0, 1, 0),
      this._scene
    );

    // Create a built-in "ground" shape.
    let ground = MeshBuilder.CreateGround(
      'ground1',
      { width: 10, height: 10, subdivisions: 2 },
      this._scene
    );

    const groundMaterial = new StandardMaterial('ground', this._scene);
    groundMaterial.diffuseColor = Color3.FromInts(1, 87, 0);
    ground.material = groundMaterial;

    new Building(this._scene, ground);

    this._scene.debugLayer.show();
  }

  doRender(): void {
    // Run the render loop.
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });

    // The canvas/window resize event handler.
    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Create the game using the 'renderCanvas'.
  let game = new Game('renderCanvas');

  // Create the scene.
  game.createScene();

  // Start render loop.
  game.doRender();
});
