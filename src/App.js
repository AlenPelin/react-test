import React, { createContext, useContext, useState } from 'react';

// watch this first https://www.youtube.com/watch?v=dpw9EHDh2bM

/* customer's section */

// customer's js component
function MyComponent(props) {
  return (
    <div>
      My Component<br />
      Data: <i>{props.datasource || err('datasource is missing')}</i>
      <hr />
    </div>
  );
}

// customer's data coming from database
function createUniformContext() {
  return {
    page: {
      id: '123', 
      name: 'home'
    },
    renderings: [
      {
        id: 'r1',
        component: MyComponent,
        placeholderKey: '/main',
        datasource: 'default-ds'
      },
      {
        id: 'r2',
        component: MyComponent,
        placeholderKey: '/main',
        datasource: 'another instance of my component'
      },
    ],
    rules: [
      {
        component: 'r1',
        action: 'change-datasource',
        datasource: 'thanks for waiting!',

        type: 'timeout',
        timeout: 3000,
      }
    ]
  };
}

// customer's app
function App() {
  const uniformContext = createUniformContext();

  return (
    <div className="App">
      <PersonalizationContext initialContext={uniformContext}>    
        <Placeholder placeholderKey='/main' />
      </PersonalizationContext>
    </div>
  );
}

export default App;

/* ==================================================================================== */

/* our libs section */

// our uniform context class
const UniformContext = createContext({});

function PersonalizationContext({children, initialContext}) {
  const [ context, setContext ] = useState(initialContext);
  const { rules, renderings } = context;
  console.log(JSON.stringify(context));
  
  rules.forEach(rule => {
    console.log('Checking rule ' + JSON.stringify(rule));
    switch (rule.type) {
      case 'timeout': 
        const timeout = rule.timeout;
        if (timeout <= 0 || timeout > 10000) {
          err('bad-timeout: ' + timeout);
        }

        const id = rule.component;
        renderings.filter(r => r.id === id).forEach(r => {
          console.log('Enabling personalization for component ' + id + ' (timeout: ' + timeout + ')');

          setTimeout(() => {
            console.log('Personalizing component ' + id);
            r.datasource = rule.datasource;
            setContext(context);
            console.log(JSON.stringify(context));
          }, timeout);
        });
        break;
      default:
        err('not-supported: ' + rule.type);
    }
  });


  return (
    <UniformContext.Provider value={context}>    
      {children}
    </UniformContext.Provider>
  );
}

// our placeholder logic
function Placeholder({placeholderKey}) {
  const uniformContext = useContext(UniformContext);
  const renderings = [];
  uniformContext.renderings.forEach(r => {
    if (r.placeholderKey === placeholderKey) {
      renderings.push(r);
    }
  });

  return renderings.map(r => React.createElement(r.component,  { key: r.id, datasource: r.datasource }));
}

// helpers, not interesting

function err(msg) {
  throw new Error(msg);
}