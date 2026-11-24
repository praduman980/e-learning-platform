import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import API from '../api/axios';
import { FiCreditCard, FiLock, FiShield } from 'react-icons/fi';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx'); // Test key

const PaymentForm = ({ course, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    const cardElement = elements.getElement(CardElement);

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        await API.post('/payment/confirm', {
          paymentIntentId: paymentIntent.id,
        });
        navigate(`/courses/${course._id}`, { state: { paymentSuccess: true } });
      } catch (err) {
        setError('Failed to confirm enrollment. Please contact support.');
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-dark-700 mb-2">Card Details</label>
        <div className="input-field p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1e293b',
                  '::placeholder': { color: '#94a3b8' },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-primary w-full flex items-center justify-center space-x-2"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
        ) : (
          <>
            <FiLock className="h-5 w-5" />
            <span>Pay ${course?.price} - Enroll Now</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center space-x-2 text-sm text-dark-400">
        <FiShield className="h-4 w-4" />
        <span>Secured by Stripe. Your payment info is safe.</span>
      </div>
    </form>
  );
};

const PaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [course, setCourse] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await API.get(`/courses/${courseId}`);
        setCourse(data.course);
      } catch (error) {
        navigate('/courses');
      }
    };
    fetchCourse();
  }, [courseId, navigate]);

  useEffect(() => {
    if (course && !course.isFree) {
      const createPayment = async () => {
        try {
          const { data } = await API.post('/payment/create-intent', {
            courseId: course._id,
          });
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error('Payment intent error:', error);
        } finally {
          setLoading(false);
        }
      };
      createPayment();
    }
  }, [course]);

  if (loading || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Course Summary */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="h-40 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg mb-4 flex items-center justify-center">
                <FiCreditCard className="h-12 w-12 text-white" />
              </div>
              <h3 className="font-semibold text-dark-900 mb-2">{course.title}</h3>
              <div className="space-y-2 text-sm text-dark-500">
                <p>Category: {course.category}</p>
                <p>Level: {course.level}</p>
                <p>Lectures: {course.lectures?.length || 0}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-dark-200">
                <div className="flex justify-between items-center">
                  <span className="text-dark-600">Total:</span>
                  <span className="text-3xl font-bold text-dark-900">${course.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-3">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark-900 mb-6">Complete Payment</h2>
              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm course={course} clientSecret={clientSecret} />
                </Elements>
              ) : (
                <div className="text-center py-8 text-dark-500">
                  Setting up payment...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

