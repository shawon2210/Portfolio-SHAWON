/**
 * 3D Anchored Object System Types and Global Registry
 * Allows DOM elements with data-3d="<name>" or <Anchor3D name="...">
 * to project their viewport coordinates to the single shared WebGL canvas.
 */

import * as THREE from 'three';

export type AnchorName =
  | 'hero-centerpiece'
  | 'about-torus'
  | 'about-gyro'
  | 'about-blocks'
  | 'about-noise-sphere'
  | 'skills-icon'
  | 'contact-globe';

export interface AnchorRegistration {
  name: AnchorName;
  element: HTMLElement;
  screenRect: DOMRect;
  worldPos: THREE.Vector3;
  worldScale: THREE.Vector3;
  isVisible: boolean;
}

class Anchor3DRegistry {
  private anchors: Map<AnchorName, AnchorRegistration> = new Map();
  private listeners: Set<() => void> = new Set();

  register(name: AnchorName, element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    this.anchors.set(name, {
      name,
      element,
      screenRect: rect,
      worldPos: new THREE.Vector3(),
      worldScale: new THREE.Vector3(1, 1, 1),
      isVisible: true,
    });
    this.notify();
  }

  unregister(name: AnchorName) {
    this.anchors.delete(name);
    this.notify();
  }

  get(name: AnchorName): AnchorRegistration | undefined {
    return this.anchors.get(name);
  }

  getAll(): AnchorRegistration[] {
    return Array.from(this.anchors.values());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  updateRects() {
    for (const item of this.anchors.values()) {
      item.screenRect = item.element.getBoundingClientRect();
      const inView =
        item.screenRect.bottom > 0 &&
        item.screenRect.top < window.innerHeight &&
        item.screenRect.right > 0 &&
        item.screenRect.left < window.innerWidth;
      item.isVisible = inView;
    }
  }
}

export const anchorRegistry = new Anchor3DRegistry();
