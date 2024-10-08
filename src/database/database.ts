import mongoose from 'mongoose';
import { ConfigService } from '../config/config.service';

const ConnectDB = async () => {
    try {
        const connectString = new ConfigService().get("CONNECT_STRING");
        await mongoose.connect(connectString);
        console.log('Підключено до бази даних');
    } catch (error) {
        console.error('Помилка підключення до бази даних:', error);
        process.exit(1);
    }
};

export default ConnectDB;
