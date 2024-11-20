
import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { CommonActions, useNavigation } from '@react-navigation/native';

interface LoginFormValues {
    userID: string;
    otp: string;
}

const LoginSchema = Yup.object().shape({
    userID: Yup.string().required('User ID is required'),
    otp: Yup.string().required('OTP is required').length(6, 'OTP must be 6 digits'),
});


export default function LoginScreen() {
    const [loading, setLoading] = useState<boolean>(false);
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
    const nav = useNavigation()
    const navigateToDashboard = () => {
        console.log('navigated to Dashboard')
        nav.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }]
            })
        )
    }
    const handleLogin = async (
        values: LoginFormValues,
        { setSubmitting }: FormikHelpers<LoginFormValues>
    ) => {
        if (!values.userID || !values.otp) {
            Alert.alert('Error', 'Please enter both User ID and OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                'https://be.platform.simplifii.com/api/v1/admin/authenticate',
                {
                    username: values.userID,
                    password: values.otp
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            if (response && response.data) {
                if (response.data.msg === "Success") {
                    console.log('Login successful!');
                    Alert.alert(
                        'Success',
                        'Logged in successfully!',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    // Replace the current screen with Dashboard

                                    navigateToDashboard();
                                }
                            }
                        ]
                    );
                    navigateToDashboard();

                } else {
                    console.log('Login failed:', response.data.message);
                    Alert.alert(
                        'Error',
                        response.data.message || 'Login failed. Please try again.'
                    );
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Log the error details
                console.log('Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });

                Alert.alert(
                    'Error',
                    error.response?.data?.message || 'Failed to verify OTP. Please try again.'
                );
            } else {
                console.log('Unexpected error:', error);
                Alert.alert('Error', 'An unexpected error occurred');
            }
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    // the logic for getting the otp i will do from here 

    const handleSendOtp = async (userID: string): Promise<void> => {
        if (!userID) {
            Alert.alert('Error', 'Please enter User ID first');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                'https://be.platform.simplifii.com/api/v1/get_otp',
                {
                    username: userID
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );
            console.log(response.status)

            if (response.status === 200) {
                setIsOtpSent(true);
                console.log("i am in")
                Alert.alert('Success', 'OTP sent successfully to your registered email!');
            } else {
                Alert.alert('Error', response.data.message || 'Failed to send OTP');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('Error response:', error.response); // Add this for debugging
                Alert.alert(
                    'Error',
                    error.response?.data?.message || 'Failed to send OTP. Please try again.'
                );
            } else {
                Alert.alert('Error', 'An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Hello There!</Text>
                <Text style={styles.title2}>Welcome Back</Text>
                <Text style={styles.title3}>Sign in to Continue</Text>
            </View>

            <Formik<LoginFormValues>
                initialValues={{ userID: '', otp: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    isSubmitting
                }) => (
                    <View style={styles.formContainer}>

                        <TextInput
                            style={styles.input}
                            placeholder="User ID"
                            onChangeText={handleChange('userID')}
                            onBlur={handleBlur('userID')}
                            value={values.userID}
                            autoCapitalize="none"
                            keyboardType="default"
                        />
                        {touched.userID && errors.userID &&
                            <Text style={styles.error}>{errors.userID}</Text>
                        }

                        <View style={styles.otpContainer}>

                            <TextInput
                                style={[styles.input, styles.otpInput]}
                                placeholder="Enter OTP"
                                onChangeText={handleChange('otp')}
                                onBlur={handleBlur('otp')}
                                value={values.otp}
                                autoCapitalize="none"
                                keyboardType="numeric"
                                maxLength={6}

                            />


                            <TouchableOpacity
                                style={[
                                    styles.sendOtpButton,
                                    loading && styles.buttonDisabled
                                ]}
                                onPress={() => handleSendOtp(values.userID)}
                                disabled={loading || !values.userID}
                            >
                                <Text style={styles.sendOtpText}>
                                    {isOtpSent ? 'Resend OTP' : 'Send OTP'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {touched.otp && errors.otp &&
                            <Text style={styles.error}>{errors.otp}</Text>
                        }


                        <TouchableOpacity
                            style={[
                                styles.button,
                                (loading || isSubmitting) && styles.buttonDisabled
                            ]}
                            onPress={() => handleSubmit()}
                            disabled={loading || isSubmitting}
                        >
                            {loading || isSubmitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Login</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
    },
    title: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    title2: {
        fontSize: 30,
        marginBottom: 5,
    },
    title3: {
        fontSize: 20,
        marginBottom: 40,
        color: "#a9a9a9",
    },
    formContainer: {
        marginBottom: 16,
    },
    input: {
        height: 48,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 8,
        backgroundColor: '#fff',
    },
    otpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    otpInput: {
        flex: 1,
        marginBottom: 0,
        marginRight: 8,
    },
    sendOtpButton: {
        backgroundColor: '#48d1cc',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
    },
    sendOtpText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#48d1cc',
        height: 48,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    buttonDisabled: {
        backgroundColor: '#a9a9a9',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        color: '#d9534f',
        fontSize: 12,
        marginBottom: 8,
    }


});
