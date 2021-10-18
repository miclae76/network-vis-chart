import { useElement, usePromise, useEffect, useStaleLayout, useTheme, useRect, useState, useConstraints, useSelections } from '@nebula.js/stardust';
import data from './extension/data';
import ext from './extension/ext';
import properties from './extension/properties';
import paint from './sn-paint';

export default function supernova() {
  return {
    qae: {
      properties,
      data: data(),
    },
    component() {
      const layout = useStaleLayout();
      const element = useElement();
      const theme = useTheme();
      const rect = useRect();
      const constraints = useConstraints();
      const selections = useSelections();
      const [network, setNetwork] = useState();

      useEffect(()=> {
        network && network.fit();
      }, [rect.width, rect.height]);

      usePromise(()=>
        paint({ element,layout, theme, constraints, selections }).then((n)=>setNetwork(n)),
      [layout, element, theme.name(), constraints ]);
    },

    ext: ext(),
  };
}
