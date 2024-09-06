import mongoose from 'mongoose';

const ConnectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://Vp4ITBestLviv:YYfdUlDmDehLuhbEj@bestlvivinfrastructure.6gyhx2j.mongodb.net/bot-bec2024?retryWrites=true&w=majority&appName=BESTLvivInfrastructure');
        console.log('Підключено до бази даних');
    } catch (error) {
        console.error('Помилка підключення до бази даних:', error);
        process.exit(1);
    }
};

export default ConnectDB;
