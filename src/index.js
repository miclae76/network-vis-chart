import { useElement, usePromise, useEffect, useLayout, useTheme, useRect, useState } from '@nebula.js/stardust';
import data from './extension/data';
import ext from './extension/ext';
import properties from './extension/properties';
import paint from './sn-paint'

export default function supernova(env) {
  const { sense } = env;
  return {
    qae: {
      properties,
      data: data(env),
    },
    component() {
      const layout = useLayout();
      const element = useElement();
      const theme = useTheme();
      const rect = useRect();
      const [network, setNetwork] = useState();

      const component = {
        inEditState: () => false,
        options: {
          noInteraction: false,
          backendApi: {
            selectValues: ()=>{}
          }
        }
      }
      useEffect(()=> {
        network && network.fit();
      }, [rect.width, rect.height]);

      usePromise(()=>
        paint({element,layout, theme, component}).then((n)=>setNetwork(n)),
      [layout, element, theme ]);

    },

    ext: ext(env),
  };
}
