import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

const linking = {
    prefixes: [prefix, 'mmaapp://'],
    config: {
        screens: {
            PaymentVerification: 'payment/verify'
        }
    }
};

export default function App() {
    return (
        <NavigationContainer linking={linking}>
            {/* Your app content */}
        </NavigationContainer>
    );
} 