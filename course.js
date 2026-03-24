// ════════════════════════════════════════════════════════
// COURSE.JS — Course page enroll form
// Saves to Firestore → "enrollments" collection
// ════════════════════════════════════════════════════════

async function enrollNow() {
  const name  = document.getElementById('ename')?.value.trim();
  const phone = document.getElementById('ephone')?.value.trim();
  const email = document.getElementById('eemail')?.value.trim();

  if (!name || !phone || !email) {
    alert('Please fill in all fields!');
    return;
  }

  try {
    // Save enrollment to Firestore → "enrollments" collection
    await window.db.collection('enrollments').add({
      name,
      phone,
      email,
      source:    'course-page',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Show success
    document.getElementById('enrollBody')?.classList.add('hidden');
    document.getElementById('enrollSuccess')?.classList.remove('hidden');

  } catch (err) {
    console.error('Enroll error:', err);
    // Fallback to WhatsApp if Firebase fails
    window.open(`https://wa.me/917376806654?text=Hi%20Shobhit%2C%20I%20want%20to%20enroll%20in%20the%20course.%20Name:%20${name}`, '_blank');
  }
}
