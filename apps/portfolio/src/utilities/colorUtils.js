import Color from 'color';

export function generateSemanticColors(baseHex, mode) {
  const base = Color(baseHex);
  console.log('Base color:', baseHex, 'Mode:', mode);  
  console.log('alpha will be ', base.rotate(mode === 'light' ? -60 : -40).lighten(0.2).hex())
  console.log('beta will be ', base.rotate(mode === 'light' ? 40 : 60).lighten(0.1).hex())
  return {
    alpha: { main: base.rotate(mode === 'light' ? -60 : -40).lighten(0.2).hex() },
    beta: { main: base.rotate(mode === 'light' ? 40 : 60).lighten(0.1).hex() },
    gamma: { main: base.rotate(10).saturate(0.5).hex() },
    theta: { main: base.rotate(-20).saturate(0.6).darken(0.1).hex() },
    epsilon: { main: base.desaturate(0.5).lighten(0.3).hex() },    
  };
}
