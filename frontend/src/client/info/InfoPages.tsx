import React from 'react';
import { useTranslation } from 'react-i18next';

const InfoLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="max-w-4xl mx-auto py-20 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-12 border-b-4 border-accent pb-6 inline-block">
      {title}
    </h2>
    <div className="prose prose-invert prose-emerald max-w-none space-y-8 text-gray-400 font-medium uppercase text-xs tracking-widest leading-relaxed text-left">
      {children}
    </div>
  </div>
);

export const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <InfoLayout title={t('info.about_title')}>
      {isArabic ? (
        <>
          <p>ولدت "ALL 8 POOL" من ملاحظة بسيطة: رياضات البلياردو خالدة، لكن الطريقة التي نلعب بها لا ينبغي أن تظل عالقة في الماضي. لقد بنينا جسراً بين الإثارة الجسدية للعبة والراحة الرقمية للعالم الحديث.</p>
          <p>تمكن منصتنا اللاعبين من العثور على أفضل الطاولات، وتتبع تقدمهم، وتسلق مراتب المجتمع العالمي. لأصحاب القاعات، نوفر مركز قيادة نهائي لإدارة الأصول والحجوزات وعلاقات العملاء بدقة جراحية.</p>
          <div className="grid grid-cols-2 gap-8 pt-10">
             <div className="bg-secondary/50 p-8 rounded-3xl border border-white/5">
                <p className="text-white font-black italic text-xl mb-2">مهمتنا</p>
                <p>رقمنة تجربة البلياردو دون فقدان روحها.</p>
             </div>
             <div className="bg-secondary/50 p-8 rounded-3xl border border-white/5">
                <p className="text-white font-black italic text-xl mb-2">رؤيتنا</p>
                <p>المعيار العالمي لإدارة وتصنيف رياضات البلياردو.</p>
             </div>
          </div>
        </>
      ) : (
        <>
          <p>ALL 8 POOL was born from a simple observation: cue sports are timeless, but the way we play them shouldn't be stuck in the past. We've built a bridge between the physical thrill of the game and the digital convenience of the modern world.</p>
          <p>Our platform empowers players to find the best tables, track their progress, and climb the ranks of a global community. For hall owners, we provide the ultimate command center to manage assets, bookings, and customer relationships with surgical precision.</p>
          <div className="grid grid-cols-2 gap-8 pt-10">
             <div className="bg-secondary/50 p-8 rounded-3xl border border-white/5">
                <p className="text-white font-black italic text-xl mb-2">Our Mission</p>
                <p>To digitize the billiard experience without losing its soul.</p>
             </div>
             <div className="bg-secondary/50 p-8 rounded-3xl border border-white/5">
                <p className="text-white font-black italic text-xl mb-2">Our Vision</p>
                <p>The global standard for cue sports management and ranking.</p>
             </div>
          </div>
        </>
      )}
    </InfoLayout>
  );
};

export const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <InfoLayout title={t('info.contact_title')}>
      <p>{isArabic ? "هل تحتاج إلى دعم؟ مهتم بالشراكة؟ فريقنا مستعد لمساعدتك في السيطرة على ساحتك المحلية." : "Need support? Interested in partnering? Our team is standing by to assist you in dominating your local arena."}</p>
      <div className="space-y-6 pt-10">
         <div className="flex items-center gap-4 bg-secondary/50 p-6 rounded-2xl border border-white/5">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-accent font-black italic border border-white/10">@</div>
            <div>
               <p className="text-white font-black italic">{isArabic ? "الدعم عبر البريد الإلكتروني" : "Email Support"}</p>
               <p className="text-accent">support@all8pool.pro</p>
            </div>
         </div>
         <div className="flex items-center gap-4 bg-secondary/50 p-6 rounded-2xl border border-white/5">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-accent font-black italic border border-white/10">HQ</div>
            <div>
               <p className="text-white font-black italic">{isArabic ? "المقر الرئيسي" : "Headquarters"}</p>
               <p>{isArabic ? "123 شارع كيو، منطقة البلياردو، المدينة الرقمية" : "123 Cue Street, Billiard District, Digital City"}</p>
            </div>
         </div>
      </div>
    </InfoLayout>
  );
};

export const TermsPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <InfoLayout title={t('info.terms_title')}>
      {isArabic ? (
        <>
          <section className="space-y-4">
            <h3 className="text-white font-black italic text-xl">1. قبول الشروط</h3>
            <p>من خلال الوصول إلى منصة ALL 8 POOL، فإنك توافق على الالتزام بقواعد الاشتباك هذه. إذا كنت لا تستطيع الحفاظ على المعيار، فلا يسمح لك بالتواجد في الساحة.</p>
          </section>
          <section className="space-y-4">
            <h3 className="text-white font-black italic text-xl">2. سلوك اللاعب</h3>
            <p>اللعب النظيف هو أساس نظام التصنيف لدينا. أي محاولة للتلاعب بالنتائج أو التقييمات أو العملة الافتراضية ستؤدي إلى استبعاد فوري وإنهاء الحساب.</p>
          </section>
          <section className="space-y-4">
            <h3 className="text-white font-black italic text-xl">3. مسؤولية الحجز</h3>
            <p>يجب إجراء الإلغاء قبل ساعتين على الأقل. سيؤثر "عدم الحضور" المتكرر سلباً على درجة إتقانك وقد يؤدي إلى قيود على الحجز.</p>
          </section>
        </>
      ) : (
        <>
          <section className="space-y-4">
            <h3 className="text-white font-black italic text-xl">1. Acceptance of Terms</h3>
            <p>By accessing the ALL 8 POOL platform, you agree to abide by these Rules of Engagement. If you cannot maintain the standard, you are not permitted in the arena.</p>
          </section>
          <section className="space-y-4">
            <h3 className="text-white font-black italic text-xl">2. Player Conduct</h3>
            <p>Fair play is the foundation of our ranking system. Any attempt to manipulate scores, ratings, or virtual currency will result in immediate disqualification and account termination.</p>
          </section>
          <section className="space-y-4">
            <h3 className="text-white font-black italic text-xl">3. Booking Responsibility</h3>
            <p>Cancellations must be made at least 2 hours in advance. Repeated "no-shows" will negatively impact your Mastery Score and may lead to booking restrictions.</p>
          </section>
        </>
      )}
    </InfoLayout>
  );
};

export const PrivacyPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <InfoLayout title={t('info.privacy_title')}>
      {isArabic ? (
        <>
          <section className="space-y-4">
            <h3 className="text-white font-black italic text-xl">1. جمع المعلومات</h3>
            <p>نجمع البيانات الأساسية لملف تعريف اللاعب المحترف الخاص بك: الاسم، البريد الإلكتروني، سجل المباريات، وبيانات الموقع لاكتشاف القاعات.</p>
          </section>
          <section className="space-y-4">
            <h3 className="text-white font-black italic text-xl">2. استخدام البيانات</h3>
            <p>تُستخدم بياناتك لحساب التصنيفات العالمية، وتسهيل الحجوزات، وتوفير تجربة ساحة مخصصة. نحن لا نبيع بياناتك لمعلني الطرف الثالث.</p>
          </section>
          <section className="space-y-4">
            <h3 className="text-white font-black italic text-xl">3. معايير الأمن</h3>
            <p>بيانات اعتمادك وبيانات معاملاتك محمية ببروتوكولات التشفير القياسية في الصناعة. نزاهة الساحة هي أولويتنا القصوى.</p>
          </section>
        </>
      ) : (
        <>
          <section className="space-y-4">
            <h3 className="text-white font-black italic text-xl">1. Information Collection</h3>
            <p>We collect data essential to your professional player profile: name, email, match history, and location data for hall discovery.</p>
          </section>
          <section className="space-y-4">
            <h3 className="text-white font-black italic text-xl">2. Usage of Data</h3>
            <p>Your data is used to calculate global rankings, facilitate bookings, and provide a personalized arena experience. We do not sell your soul or your data to third-party advertisers.</p>
          </section>
          <section className="space-y-4">
            <h3 className="text-white font-black italic text-xl">3. Security Standards</h3>
            <p>Your credentials and transaction data are protected by industry-standard encryption protocols. The integrity of the arena is our highest priority.</p>
          </section>
        </>
      )}
    </InfoLayout>
  );
};
