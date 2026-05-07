import { useEffect, useRef } from 'react';

export const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Handle high DPI screens for crisp rendering
    const updateSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);
    };
    updateSize();

    const particles: { x: number, y: number, z: number, baseX: number, baseZ: number }[] = [];
    const spacing = 50;
    const rows = 40;
    const cols = 60;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = (j - cols / 2) * spacing;
        const z = (i - rows / 2) * spacing;
        particles.push({ x, y: 0, z, baseX: x, baseZ: z });
      }
    }

    let count = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    
    // Array to store active ripples
    const ripples: { x: number, z: number, time: number }[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) / (width / 2);
      targetMouseY = (e.clientY - height / 2) / (height / 2);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMouseX = (e.touches[0].clientX - width / 2) / (width / 2);
        targetMouseY = (e.touches[0].clientY - height / 2) / (height / 2);
      }
    };

    const triggerRipple = () => {
      // Create a ripple roughly where the mouse is projected
      ripples.push({ x: targetMouseX * 500, z: targetMouseY * 300, time: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', triggerRipple);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchstart', (e) => {
      handleTouchMove(e);
      triggerRipple();
    });
    window.addEventListener('resize', updateSize);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2 + 100; // Center offset down slightly
      
      count += 0.02;

      // Fast mouse tracking (removes the delay/floaty feeling)
      mouseX += (targetMouseX - mouseX) * 0.4;
      mouseY += (targetMouseY - mouseY) * 0.4;

      // Update ripples
      for (let r = 0; r < ripples.length; r++) {
        ripples[r].time += 0.04; // Expansion speed
        if (ripples[r].time > 4) { // Max ripple lifetime
          ripples.splice(r, 1);
          r--;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Base undulating wave
        const wave1 = Math.sin((p.baseX * 0.01) + count + mouseX) * 40;
        const wave2 = Math.cos((p.baseZ * 0.01) + count + mouseY) * 40;
        p.y = wave1 + wave2;

        // Apply ripples effect
        for (const r of ripples) {
          const dx = p.baseX - r.x;
          const dz = p.baseZ - r.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          
          const rippleRadius = r.time * 400; // Current radius of the expanding ripple
          const distanceToRipple = Math.abs(dist - rippleRadius);
          
          if (distanceToRipple < 200) {
            // Calculate a wave bump for the ripple
            const lift = Math.cos((distanceToRipple / 200) * (Math.PI / 2));
            const fade = Math.max(0, 1 - (r.time / 4)); // Fades out as time goes on
            p.y -= lift * 120 * fade; // Lift the particle upwards (negative y)
          }
        }

        // 3D to 2D Projection
        const fov = 400;
        // Move camera back a bit and apply mouse vertical tilt
        const viewZ = p.baseZ + 1200 + (mouseY * 300); 
        
        if (viewZ > 0) {
          const scale = fov / viewZ;
          // Apply mouse horizontal pan
          const projX = (p.baseX + (mouseX * 500)) * scale + cx;
          const projY = p.y * scale + cy;
          
          // Color gradient logic (matching the VirtuLearning brand)
          // Accent (#FFD700 -> 255, 215, 0) to Text/White (#f4f4f5 -> 244, 244, 245)
          const normalizedX = (p.baseX + (cols * spacing / 2)) / (cols * spacing);
          const r = Math.floor((1 - normalizedX) * 255 + normalizedX * 244);
          const g = Math.floor((1 - normalizedX) * 215 + normalizedX * 244); 
          const b = Math.floor((1 - normalizedX) * 0   + normalizedX * 245);
          
          // Particle size depends on depth (closer = bigger)
          // Mobile devices generally have smaller screens, so adjusting scale slightly can help
          const baseSize = width < 768 ? 1.2 : 1.8;
          const size = Math.max(0.1, baseSize * scale);
          
          // Opacity fades out in the distance
          const opacity = Math.min(1, Math.max(0, scale * 1.5 - 0.2));

          ctx.beginPath();
          ctx.arc(projX, projY, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', triggerRipple);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', triggerRipple);
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-auto opacity-80"
    />
  );
};
