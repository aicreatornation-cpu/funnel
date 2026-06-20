import { useEffect, useState } from 'react';
import Landing from './components/Landing';
import Booking from './components/Booking';
import Payment from './components/Payment';
import AdminPage from './components/AdminPage';
import { videoTypes, durations } from './data/funnelData';
import { addLead, updateLead } from './leads';

const EMPTY_BOOKING = {
  name: '',
  phone: '',
  typeIdx: 0,      // 0=Birthday, 1=Wedding, 2=Anniversary, 3=Other
  durationIdx: 0,  // index into durations[]
  methodIdx: 0,    // index into paymentMethods[]
};

export default function App() {
  // Route: the `/admin` path OR `#admin` hash shows the admin page; else the funnel.
  const getRoute = () => {
    const path = window.location.pathname.replace(/\/+$/, '');
    if (path === '/admin' || window.location.hash.replace('#', '') === 'admin') return 'admin';
    return 'funnel';
  };
  const [route, setRoute] = useState(getRoute);
  useEffect(() => {
    const onChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onChange);
    window.addEventListener('popstate', onChange);
    return () => {
      window.removeEventListener('hashchange', onChange);
      window.removeEventListener('popstate', onChange);
    };
  }, []);

  // Only ONE funnel page is shown at a time. `step` is 1..3.
  const [step, setStep] = useState(1);

  // Shared booking state — flows Booking → Payment → Confirm.
  const [booking, setBooking] = useState(EMPTY_BOOKING);
  const [errors, setErrors] = useState({});
  const [leadId, setLeadId] = useState(null); // current lead row being filled

  const update = (patch) => setBooking((b) => ({ ...b, ...patch }));
  const clearError = (field) => setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [step]);

  const goTo = (n) => setStep(n);

  // Validate mandatory Booking fields, capture the lead, then go to payment.
  const proceedToPayment = async () => {
    const next = {};
    if (!booking.name.trim()) next.name = 'Please enter your full name.';
    const digits = booking.phone.replace(/\D/g, '');
    if (!booking.phone.trim()) next.phone = 'Please enter your phone number.';
    else if (digits.length < 10) next.phone = 'Enter a valid 10-digit phone number.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Capture the lead in Supabase; don't block the customer if logging fails.
    try {
      const id = await addLead({
        name: booking.name.trim(),
        phone: booking.phone.trim(),
        videoType: videoTypes[booking.typeIdx],
        duration: durations[booking.durationIdx].long,
        amount: durations[booking.durationIdx].final,
      });
      setLeadId(id);
    } catch (e) {
      console.error('Lead capture failed:', e);
    }
    goTo(3);
  };

  // Pay tapped — booking details sent to WhatsApp; mark the lead as paid.
  // No confirmation page; the customer stays on the payment screen.
  const handlePay = async () => {
    try {
      if (leadId) await updateLead(leadId, { status: 'Paid' });
    } catch (e) {
      console.error('Lead update failed:', e);
    }
  };

  if (route === 'admin') return <AdminPage />;

  return (
    <div>
      {step === 1 && <Landing onNext={() => goTo(2)} />}
      {step === 2 && (
        <Booking
          booking={booking}
          update={update}
          errors={errors}
          clearError={clearError}
          onProceed={proceedToPayment}
        />
      )}
      {step === 3 && <Payment booking={booking} onPay={handlePay} />}
    </div>
  );
}
