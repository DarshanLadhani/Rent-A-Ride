import React, { useState } from 'react';
import BikeContext from './bike.context.js';

const BikeContextProvider = ({children}) => {
    const [bikes , setBikes] = useState(null)
    return (
        <BikeContext.Provider value={{bikes , setBikes}}>
            {children}
        </BikeContext.Provider>
    )
}

export default BikeContextProvider;