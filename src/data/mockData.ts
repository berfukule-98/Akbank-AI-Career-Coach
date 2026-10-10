import { PresetScenario } from '../types/index.ts';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'internship-cs',
    name: 'Üniversite Öğrencisi / Yazılım Stajyeri',
    badge: 'Staj & Üniversite',
    targetRole: 'Yazılım Mühendisliği Stajyeri',
    interviewerTitle: 'Yetenek Kazanımı & Staj Programı Lideri (Tech Recruiter)',
    experienceLevel: 'Stajyer / Üniversite Öğrencisi',
    companyContext: 'Yenilikçi FinTech / Teknoloji Şirketi',
    sampleTrainings: [
      {
        id: 'train-1',
        title: 'Veri Yapıları ve Algoritmalar (Üniversite Dersi)',
        providerOrPlatform: 'Üniversite / Bilgisayar Mühendisliği',
        keyModulesOrContent: 'Bağlı listeler, ikili arama ağaçları, karmaşıklık analizi (Big O), sıralama algoritmaları, temel graf modelleri',
        completedYear: '2025',
        notes: 'Ders projesi olarak C++ ile basit arama motoru indeksi yapıldı.'
      },
      {
        id: 'train-2',
        title: 'Python ile Temel Programlama ve Nesne Yönelimli Tasarım',
        providerOrPlatform: 'Online Akademi',
        keyModulesOrContent: 'Python sözdizimi, fonksiyonlar, OOP (Class, Kalıtım, Kapsülleme), dosya işlemleri, unittest',
        completedYear: '2025',
        notes: 'OOP prensipleriyle terminal tabanlı kütüphane yönetim sistemi yazıldı.'
      },
      {
        id: 'train-3',
        title: 'Git ve GitHub ile Modern Versiyon Kontrolü',
        providerOrPlatform: 'Açık Kaynak Atölyesi',
        keyModulesOrContent: 'Git commit, branch yönetimi, merge çakışmaları, GitHub Pull Request akışları, temel CI/CD prensipleri',
        completedYear: '2026',
        notes: 'Açık kaynak öğrenci projelerinde PR açma pratiği kazanıldı.'
      }
    ]
  },
  {
    id: 'junior-to-mid-frontend',
    name: 'Junior Frontend -> Mid Seviye Terfi/Geçiş',
    badge: 'Kariyer İlerlemesi',
    targetRole: 'Frontend Developer',
    interviewerTitle: 'Engineering Manager (Mühendislik Yöneticisi)',
    experienceLevel: 'Yeni Mezun / Junior',
    companyContext: 'Hızlı Büyüyen E-Ticaret Platformu',
    sampleTrainings: [
      {
        id: 'train-fe-1',
        title: 'Modern React & TypeScript Masterclass',
        providerOrPlatform: 'Udemy / Coursera',
        keyModulesOrContent: 'React 18+ Hooks, Custom Hooks, Strict TypeScript tipleri, Component yaşam döngüsü, Context API',
        completedYear: '2025',
        notes: 'Type-safe bileşen kütüphaneleri geliştirildi.'
      },
      {
        id: 'train-fe-2',
        title: 'Web Performansı ve State Yönetimi (Zustand & TanStack Query)',
        providerOrPlatform: 'Frontend Masters',
        keyModulesOrContent: 'Server state vs client state, cache geçersiz kılma, Bundle analizi, Lazy loading, Core Web Vitals optimizasyonu',
        completedYear: '2025',
        notes: 'Büyük veri listelemede virtual scroll ve memoization uygulandı.'
      },
      {
        id: 'train-fe-3',
        title: 'Tailwind CSS ve Erişilebilir (A11y) Tasarım Sistemleri',
        providerOrPlatform: 'Design Systems Workshop',
        keyModulesOrContent: 'WCAG 2.1 AA kontrast standartları, ARIA öznitelikleri, klavye navigasyonu, tasarım belirteçleri (Design Tokens)',
        completedYear: '2026',
        notes: 'Ekran okuyucu uyumlu modal ve dropdown sistemleri geliştirildi.'
      }
    ]
  },
  {
    id: 'data-analyst-to-ai',
    name: 'Veri Analisti -> Veri Bilimi & Makine Öğrenimi',
    badge: 'Kariyer Değişimi',
    targetRole: 'Junior Machine Learning / Data Scientist',
    interviewerTitle: 'Lead Data Scientist & AI Tribe Lead',
    experienceLevel: 'Mid-Level (2-4 Yıl)',
    companyContext: 'Büyük Veri & Telekom Şirketi',
    sampleTrainings: [
      {
        id: 'train-da-1',
        title: 'İleri Seviye SQL ve İlişkisel Veri Modelleme',
        providerOrPlatform: 'Datacamp',
        keyModulesOrContent: 'Window functions, CTE, indexleme stratejileri, sorgu optimizasyonu, PostgreSQL ile karmaşık aggregation',
        completedYear: '2024',
        notes: 'Milyonluk müşteri tablosunda kohort ve churn analiz sorguları yazıldı.'
      },
      {
        id: 'train-da-2',
        title: 'Python ile Keşifçi Veri Analizi ve Görselleştirme',
        providerOrPlatform: 'Kaggle Learn',
        keyModulesOrContent: 'Pandas, NumPy, Seaborn, Matplotlib, eksik veri tamamlama, aykırı değer analizi (Outlier detection)',
        completedYear: '2025',
        notes: 'İş zekası panoları için otomatik veri temizleme pipeline kuruldu.'
      },
      {
        id: 'train-da-3',
        title: 'Uygulamalı Makine Öğrenimine Giriş (Scikit-Learn)',
        providerOrPlatform: 'Coursera',
        keyModulesOrContent: 'Doğrusal regresyon, Lojistik regresyon, Karar ağaçları, Random Forest, Çapraz doğrulama (Cross-Validation), F1-Score/AUC metrikleri',
        completedYear: '2025',
        notes: 'Kredi risk tahmini için sınıflandırma modeli eğitildi.'
      }
    ]
  }
];
