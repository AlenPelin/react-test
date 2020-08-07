import React, { createContext, useContext, useState } from 'react';

// customer's js component
function MyComponent(props) {
  return (
    <div>
      My Component<br />
      Data: <i>{props.data || err('data is missing')}</i>
      <hr />
    </div>
  );
}

// customer's app
function App() {
  // will be dynamic i.e. coming from the restful service
  const initialContext = {
    renderings: [
      {
        id: 'r1',
        component: MyComponent,
        data: 'default-data'
      }
    ]
  };

  return (
    <div className="App">
      <PersonalizationContext initialContext={initialContext}>    
        <Placeholder />
      </PersonalizationContext>
    </div>
  );
}

export default App;

/* ================ UNIFORM LIBS =================================================================== */

const UniformContext = createContext({});

function PersonalizationContext({children, initialContext}) {
  const [ context, setContext ] = useState(initialContext);
  const { renderings } = context;
  console.log(JSON.stringify(context));

  renderings.forEach(rendering => {
    console.log('Enabling personalization for component ' + rendering.id);

    setTimeout(() => {
      console.log('Personalizing component ' + rendering.id);
      
      // context.renderings[i].rendering.data = 'personalized data';
      rendering.data = 'personalized data';
      setContext(context);

      console.log(JSON.stringify(context));
    }, 2000);
  });

  return (
    <UniformContext.Provider value={context}>    
      {children}
    </UniformContext.Provider>
  );
}

function Placeholder() {
  const context = useContext(UniformContext);

  return context.renderings.map(r => 
    React.createElement(r.component,  { key: r.id, data: r.data })
  );
}

function err(msg) {
  throw new Error(msg);
}