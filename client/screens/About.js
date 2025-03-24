import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React from "react";
import FooterMenu from "../components/Menus/FooterMenu";
import Icon from "react-native-vector-icons/MaterialIcons";

const About = () => {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <View style={styles.header}>
                    <Icon name="shopping-bag" size={64} color="#6200ea" />
                    <Text style={styles.title}>About Our Shop</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Who We Are</Text>
                    <Text style={styles.text}>
                        Welcome to our premier e-commerce platform! We are dedicated to providing
                        a seamless shopping experience with a wide range of high-quality products
                        across multiple categories including electronics, fashion, beauty, and more.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Mission</Text>
                    <Text style={styles.text}>
                        Our mission is to make online shopping accessible, enjoyable, and secure
                        for everyone. We strive to offer competitive prices, excellent customer
                        service, and a user-friendly shopping experience.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Features</Text>
                    <View style={styles.featureList}>
                        <View style={styles.feature}>
                            <Icon name="security" size={24} color="#6200ea" />
                            <Text style={styles.featureText}>Secure Shopping</Text>
                        </View>
                        <View style={styles.feature}>
                            <Icon name="local-shipping" size={24} color="#6200ea" />
                            <Text style={styles.featureText}>Fast Delivery</Text>
                        </View>
                        <View style={styles.feature}>
                            <Icon name="support-agent" size={24} color="#6200ea" />
                            <Text style={styles.featureText}>24/7 Support</Text>
                        </View>
                        <View style={styles.feature}>
                            <Icon name="payment" size={24} color="#6200ea" />
                            <Text style={styles.featureText}>Secure Payments</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <Text style={styles.text}>
                        Email: support@ourshop.com{"\n"}
                        Phone: +1 (555) 123-4567{"\n"}
                        Hours: Monday - Friday, 9:00 AM - 6:00 PM EST
                    </Text>
                </View>
            </ScrollView>

            <FooterMenu />
        </View>
    );
};

export default About;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6200ea',
        marginTop: 10,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
    },
    featureList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    feature: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    featureText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
});
