// Course data structure for the learning profile tournament
export const courses = [
  {
    id: 1,
    name: "Cömert Dinleme",
    description: "Etkili dinleme teknikleri kursu",
    image: "./images/comert_dinleme.jpg"
  },
  {
    id: 2,
    name: "Zaman Yönetimi",
    description: "Zamanı verimli kullanma yöntemleri",
    image: "./images/zaman_yonetimi.jpg"
  },
  {
    id: 3,
    name: "Yaratıcı Düşünce",
    description: "Yaratıcılığı geliştirme teknikleri",
    image: "./images/yaratici_dusunce.jpg"
  },
  {
    id: 4,
    name: "Stres Yönetimi",
    description: "Stresi kontrol altına alma yolları",
    image: "./images/stres_yonetimi.jpg"
  },
  {
    id: 5,
    name: "Etkili İletişim",
    description: "İletişim becerilerini güçlendirme",
    image: "./images/etkili_iletisim.jpg"
  },
  {
    id: 6,
    name: "Liderlik Becerileri",
    description: "Liderlik özelliklerini geliştirme",
    image: "./images/liderlik.jpg"
  },
  {
    id: 7,
    name: "Problem Çözme",
    description: "Analitik düşünce ve çözüm üretme",
    image: "./images/problem_cozme.jpg"
  },
  {
    id: 8,
    name: "Motivasyon",
    description: "İç motivasyonu artırma yöntemleri",
    image: "./images/motivasyon.jpg"
  },
  {
    id: 9,
    name: "Ekip Çalışması",
    description: "Takım halinde çalışma becerileri",
    image: "./images/ekip_calismasi.jpg"
  },
  {
    id: 10,
    name: "Eleştirel Düşünce",
    description: "Eleştirel analiz ve değerlendirme",
    image: "./images/elestirel_dusunce.jpg"
  },
  {
    id: 11,
    name: "Duygusal Zeka",
    description: "Duyguları anlama ve yönetme",
    image: "./images/duygusal_zeka.jpg"
  },
  {
    id: 12,
    name: "Sunum Becerileri",
    description: "Etkili sunum hazırlama ve sunma",
    image: "./images/sunum_becerileri.jpg"
  },
  {
    id: 13,
    name: "Karar Verme",
    description: "Doğru karar alma teknikleri",
    image: "./images/karar_verme.jpg"
  },
  {
    id: 14,
    name: "Öğrenme Teknikleri",
    description: "Hızlı ve etkili öğrenme yöntemleri",
    image: "./images/ogrenme_teknikleri.jpg"
  },
  {
    id: 15,
    name: "Özgüven Geliştirme",
    description: "Kendine güveni artırma teknikleri",
    image: "./images/ozguven.jpg"
  },
  {
    id: 16,
    name: "Hedef Belirleme",
    description: "SMART hedefler ve planlama",
    image: "./images/hedef_belirleme.jpg"
  }
];

// Helper function to get a course by ID
export const getCourseById = (id) => {
  return courses.find(course => course.id === id);
};

// Helper function to get multiple courses by IDs
export const getCoursesByIds = (ids) => {
  return ids.map(id => getCourseById(id)).filter(Boolean);
};