# Proje PRD: SponsorAI (Sponsorluk Takip ve Akıllı E-posta Asistanı)

**1. Ürün Vizyonu**
Öğrenci kulüpleri ve organizasyonlar için potansiyel sponsor şirketlerinin sektörlerine göre (Gıda, Kozmetik, Kırtasiye vb.) eklenebildiği, durumlarının takip edilebildiği ve tek tuşla profesyonel sponsorluk teklif e-postası şablonlarının oluşturulabildiği modern bir web uygulaması.

**2. Temel Özellikler (MVP)**
* **Firma Ekleme:** Şirket Adı ve Sektör (Gıda, Kozmetik, Kırtasiye, Diğer) seçilerek listeye eklenebilmeli.
* **Kanban/Liste Görünümü:** Eklenen firmalar listelenmeli. Her firmanın bir "Durum" (Beklemede, Görüşüldü, Red, Onaylandı) etiketi olmalı ve bu durum güncellenebilmeli.
* **Hızlı Arama ve Filtreleme:** İsimle arama yapılabilmeli veya sektöre göre liste filtrelenebilmeli.
* **AI Şablon Motoru (Mock):** Firmanın yanındaki "Şablon Üret" butonuna basıldığında, firmanın adına ve sektörüne özel hazır bir e-posta teklif metni ekranda (Modal içinde) belirmeli.
* **Hızlı Gönderim:** Üretilen şablonun altında bir "Panoya Kopyala" ve kullanıcının kendi mail uygulamasını açan bir "Mail Gönder (mailto:)" butonu bulunmalı.
* **Veri Saklama:** Tüm veriler tarayıcının `localStorage` hafızasında tutulmalı.

**3. Teknik Gereksinimler**
* Framework: React + Vite (TypeScript)
* Stil: Tailwind CSS
* İkonlar: Lucide React
* Tasarım: Profesyonel, temiz, açık/koyu gri tonlarında, mobil uyumlu.
