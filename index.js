import app from './src/app.js';
import dotenv from 'dotenv';
import conection from './src/dB/conection.js';

conection()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("Mongo Db connection is failed: ", error);
    });