import React, { useState, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
    Animated, ScrollView
} from 'react-native';
import { Colors } from '../../utils/theme';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { GoogleIcon } from '../../components/icons/GoogleIcon';

type AuthStep = 'email' | 'login' | 'signup' | 'sso';

export default function AuthScreen() {
    const [step, setStep] = useState<AuthStep>('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [ssoProvider, setSsoProvider] = useState<'google' | 'apple' | null>(null);

    const { signIn, signUp, signInWithGoogle, signInWithApple, getSignInMethods } = useAuth();
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const animateTransition = (callback: () => void) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            callback();
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });
    };

    const handleEmailContinue = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        try {
            setCheckingEmail(true);
            const methods = await getSignInMethods(email);

            animateTransition(() => {
                if (methods.length === 0) {
                    // New user
                    setStep('signup');
                } else if (methods.includes('google.com')) {
                    setSsoProvider('google');
                    setStep('sso');
                } else if (methods.includes('apple.com')) {
                    setSsoProvider('apple');
                    setStep('sso');
                } else {
                    // Has password-based account
                    setStep('login');
                }
            });
        } catch (error: any) {
            Alert.alert('Error', 'Could not check email. Please try again.');
        } finally {
            setCheckingEmail(false);
        }
    };

    const handleLogin = async () => {
        if (!password) {
            Alert.alert('Error', 'Please enter your password');
            return;
        }

        try {
            setLoading(true);
            await signIn(email, password);
        } catch (error: any) {
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                Alert.alert('Incorrect Password', 'The password you entered is incorrect. Please try again.');
            } else {
                Alert.alert('Login Failed', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!password) {
            Alert.alert('Error', 'Please enter a password');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            await signUp(email, password);
        } catch (error: any) {
            Alert.alert('Sign Up Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            await signInWithGoogle();
        } catch (error: any) {
            if (error.code !== 'SIGN_IN_CANCELLED') {
                Alert.alert('Google Sign-In Failed', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAppleSignIn = async () => {
        try {
            setLoading(true);
            await signInWithApple();
        } catch (error: any) {
            if (error.code !== 'ERR_REQUEST_CANCELED') {
                Alert.alert('Apple Sign-In Failed', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        animateTransition(() => {
            setStep('email');
            setPassword('');
            setConfirmPassword('');
            setSsoProvider(null);
        });
    };

    const getTitle = () => {
        switch (step) {
            case 'email': return 'Welcome to Gulper';
            case 'login': return 'Welcome Back!';
            case 'signup': return 'Create Account';
            case 'sso': return 'Welcome Back!';
        }
    };

    const getSubtitle = () => {
        switch (step) {
            case 'email': return 'Enter your email to get started';
            case 'login': return `Sign in as ${email}`;
            case 'signup': return `Create an account for ${email}`;
            case 'sso': return `You signed up with ${ssoProvider === 'google' ? 'Google' : 'Apple'}`;
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Back button (shown on login/signup steps) */}
                {step !== 'email' && (
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                    </TouchableOpacity>
                )}

                <View style={styles.header}>
                    <Text style={styles.title}>{getTitle()}</Text>
                    <Text style={styles.subtitle}>{getSubtitle()}</Text>
                </View>

                <Animated.View style={[styles.form, { opacity: fadeAnim }]}>
                    {/* Step 1: Email */}
                    {step === 'email' && (
                        <>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    autoFocus
                                    onSubmitEditing={handleEmailContinue}
                                    returnKeyType="next"
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleEmailContinue}
                                disabled={checkingEmail}
                            >
                                {checkingEmail ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Continue</Text>
                                )}
                            </TouchableOpacity>

                            {/* Divider */}
                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>or continue with</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            {/* SSO Circular Buttons */}
                            <View style={styles.ssoRow}>
                                <TouchableOpacity
                                    style={styles.ssoButton}
                                    onPress={handleGoogleSignIn}
                                    disabled={loading}
                                >
                                    <GoogleIcon size={24} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.ssoButton, styles.appleButton]}
                                    onPress={handleAppleSignIn}
                                    disabled={loading}
                                >
                                    <Ionicons name="logo-apple" size={26} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    {/* Step 2a: Login (existing user) */}
                    {step === 'login' && (
                        <>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    autoFocus
                                    onSubmitEditing={handleLogin}
                                    returnKeyType="done"
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Log In</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.switchLink} onPress={() => {
                                animateTransition(() => setStep('signup'));
                            }}>
                                <Text style={styles.switchText}>
                                    Wrong account? <Text style={styles.switchBold}>Create new one</Text>
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Step 2b: Sign Up (new user) */}
                    {step === 'signup' && (
                        <>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Create Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="At least 6 characters"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    autoFocus
                                    returnKeyType="next"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    onSubmitEditing={handleSignUp}
                                    returnKeyType="done"
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleSignUp}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Sign Up</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.switchLink} onPress={() => {
                                animateTransition(() => setStep('login'));
                            }}>
                                <Text style={styles.switchText}>
                                    Already have an account? <Text style={styles.switchBold}>Log in</Text>
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Step 2c: SSO account (signed up with Google/Apple) */}
                    {step === 'sso' && (
                        <>
                            <View style={styles.ssoPrompt}>
                                <Text style={styles.ssoPromptText}>
                                    This account was created using {ssoProvider === 'google' ? 'Google' : 'Apple'} Sign-In.
                                    Tap below to continue.
                                </Text>
                            </View>

                            {ssoProvider === 'google' ? (
                                <TouchableOpacity
                                    style={styles.googleSsoButton}
                                    onPress={handleGoogleSignIn}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#333" />
                                    ) : (
                                        <>
                                            <GoogleIcon size={22} />
                                            <Text style={styles.googleSsoButtonText}>Continue with Google</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={styles.appleSsoButton}
                                    onPress={handleAppleSignIn}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Ionicons name="logo-apple" size={22} color="#fff" />
                                            <Text style={styles.appleSsoButtonText}>Continue with Apple</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity style={styles.switchLink} onPress={() => {
                                animateTransition(() => setStep('login'));
                            }}>
                                <Text style={styles.switchText}>
                                    Use <Text style={styles.switchBold}>password</Text> instead
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background || '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        padding: 8,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    button: {
        backgroundColor: Colors.green || '#4CAF50',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 28,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    dividerText: {
        marginHorizontal: 12,
        color: Colors.textSecondary || '#999',
        fontSize: 13,
    },
    ssoRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    ssoButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    appleButton: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    switchLink: {
        marginTop: 24,
        alignItems: 'center',
    },
    switchText: {
        color: Colors.textSecondary || '#666',
        fontSize: 14,
    },
    switchBold: {
        color: Colors.green || '#4CAF50',
        fontWeight: 'bold',
    },
    ssoPrompt: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
    },
    ssoPromptText: {
        fontSize: 15,
        color: Colors.textSecondary || '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    googleSsoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    googleSsoButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    appleSsoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    appleSsoButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
