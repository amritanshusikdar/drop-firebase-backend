import faker from 'faker';
import admin from 'firebase-admin';
import 'firebase-functions';

// process.env.GCLOUD_PROJECT = 'here-your-project-id';
process.env.GCLOUD_PROJECT = 'here-your-project-id';
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

admin.initializeApp();
const db = admin.firestore();

export const generateFakeData = async () => {
    try {
        for (let i = 0; i < 10; i++) {
            await db.collection('users').add({
                name: faker.name.findName(),
                contact: faker.phone.phoneNumber(),
            });

            await db.collection('orders').add({
                orderId: faker.datatype.uuid(),
                receivedAt: faker.time.recent(),
                price: faker.commerce.price(),
                name: faker.commerce.productName(),
                material: faker.commerce.productMaterial(),
                description: faker.commerce.productDescription(),
            });
        }
        const data = await db.collection('users').get();
        data.forEach((doc) => console.log(doc.get('name'), doc.get('contact')));
    } catch (error) {
        console.log('Error in inserting FAKE DATA: ', error);
    }
};
