import type { Metadata } from "next";
import Link from "@/components/navigation/site-link";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "Sultan Okulları Kişisel Verilerin Korunması ve İşlenmesine İlişkin Aydınlatma Metni — 6698 sayılı KVKK kapsamında haklarınız ve veri işleme politikamız.",
};

const sections = [
  {
    id: "I",
    title: "Kişisel Verilerinizi Toplamamızın Yöntemi ve Hukuki Sebebi Nedir?",
    content: (
      <p>
        Kişisel verileriniz; kayıt/ön kayıt başvurunuz sırasında ve/veya
        sonrasında yazılı ve sözlü olarak ve/veya elektronik ortamda tarafımıza
        iletmiş olduğunuz, sağlık bilgileri de dahil olmak üzere özel nitelikli
        kişisel verilerinizi de içeren her türlü bilgi ve belgeyi ifade etmekte
        olup bu bilgiler fiziki ve dijital ortamda saklanmaktadır. Kişisel
        verileriniz, KVKK tarafından öngörülen temel ilkelere uygun olarak,
        KVKK&#39;nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme
        şartları ve amaçları kapsamında işbu Aydınlatma Metninde belirtilen
        gerçek ve tüzel kişiler ile aşağıda yer alan amaçlarla yurt içinde ve
        yurt dışında işlenebilmekte ve aktarılabilmektedir.
      </p>
    ),
  },
  {
    id: "II",
    title: "Kişisel Verilerinizi Hangi Amaçla İşliyoruz?",
    content: (
      <>
        <p>Kişisel verileriniz;</p>
        <ul className="mt-fluid-3 list-inside list-disc space-y-fluid-1 pl-fluid-2">
          <li>
            İlgili her türlü mevzuata uygun olarak kayıt ve ön kayıt işlemlerini
            gerçekleştirmek,
          </li>
          <li>
            Sultan Okulları tarafından tanımlanan amaçlar doğrultusunda
            eğitim-öğretim faaliyetlerimizi yürütmek,
          </li>
          <li>
            Kayıt, veli toplantısı, etkinlik gibi süreçleri yönetmek ve
            tarafınızın kullanımına sunmak için gerekli her türlü işlemi yerine
            getirmek,
          </li>
          <li>
            Hizmetlerimiz ve etkinliklerimiz ile ilgili tarafınıza bilgilendirme
            yapmak,
          </li>
          <li>
            Kampanya, duyuru ve okul gelişmelerinden tarafınızın haberdar
            edilmesini sağlamak,
          </li>
          <li>
            Sultan Okulları menfaat ve politikaları doğrultusunda faaliyetleri
            yürütmek,
          </li>
          <li>
            Hizmetlerin iyileştirilmesi için kimliği ifşa edilmeden
            istatistiksel çalışmalarda kişisel veri ve bilgileri değerlendirerek
            analiz yapmak,
          </li>
          <li>
            Tarafınızın talep edeceği bilgi, etkinlik ve hizmetlerle ilgili
            bilgilendirme yapmak,
          </li>
          <li>
            Sultan Okulları tarafından muhafaza edilen kişisel verilerinizin
            güvenliğini sağlamak ve bu amaçla verilerinizi muhafaza etmek üzere
            aktarmak,
          </li>
          <li>
            Veri kayıplarının önlenebilmesi için kopyalama/yedekleme yapmak,
          </li>
          <li>
            Yasal mevzuata uygun şekilde ayrıca onay alınmak suretiyle ticari
            elektronik ileti gönderebilmek,
          </li>
          <li>
            Yasal düzenlemelerin gerektirdiği veya zorunlu kıldığı şekilde yasal
            yükümlülükleri yerine getirmek,
          </li>
          <li>
            KVKK&#39;da belirtilen diğer amaçlarla, Sultan Okulları ve ilgili
            kişiler tarafından işlenebilmektedir.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "III",
    title: "Kişisel Verilerinizi Kimlere ve Hangi Amaçla Aktarıyoruz?",
    content: (
      <p>
        Toplanan kişisel verileriniz, KVKK tarafından öngörülen temel ilkelere
        uygun olarak ve KVKK&#39;nın 8. ve 9. maddelerinde belirtilen kişisel
        veri işleme şartları ve amaçları dahilinde; Sultan Okulları iş
        ortaklarına, tedarikçilerine, servis sağlayıcılarına ve kanunen yetkili
        kamu kurumlarına aktarılabilmektedir.
      </p>
    ),
  },
  {
    id: "IV",
    title:
      "KVKK Uyarınca Sultan Okulları'nın Kişisel Verilerinizi Açık Rıza Olmaksızın İşleyebileceği Haller",
    content: (
      <>
        <p>
          KVKK&#39;nın 5. maddesi uyarınca aşağıdaki hallerde Sultan Okulları,
          açık rızanız aranmaksızın kişisel verilerinizi işleyebilir:
        </p>
        <ul className="mt-fluid-3 list-inside list-disc space-y-fluid-1 pl-fluid-2">
          <li>Kanunlarda açıkça öngörüldüğü hallerde,</li>
          <li>
            Fiili imkânsızlık nedeniyle rızanızı açıklayamayacak durumda olmanız
            veya rızanıza hukuki geçerlilik tanınmayan hallerde kendinizin ya da
            bir başkasının hayatı veya beden bütünlüğünün korunması için kişisel
            verinizin işlenmesinin zorunlu olması,
          </li>
          <li>
            Sultan Okulları ile akdettiğiniz bir sözleşmenin kurulması veya
            ifasıyla doğrudan ilgili olması kaydıyla sözleşme taraflarına ait
            kişisel verilerin işlenmesinin gerekli olması,
          </li>
          <li>
            Sultan Okulları&#39;nın bir hukuki yükümlülüğünü yerine
            getirebilmesi için zorunlu olması,
          </li>
          <li>Kişisel verinizin tarafınızca alenileştirilmiş olması,</li>
          <li>
            Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin
            zorunlu olması,
          </li>
          <li>
            Sahip olduğunuz temel hak ve özgürlüklerinize zarar vermemek
            kaydıyla Sultan Okulları&#39;nın meşru menfaatleri için veri
            işlenmesinin zorunlu olması.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "V",
    title:
      "Veri Sahibi Olarak KVKK'nın 11. Maddesinde Sayılan Haklarınız Nelerdir?",
    content: (
      <>
        <p>Kişisel veri sahibi olarak;</p>
        <ul className="mt-fluid-3 list-inside list-disc space-y-fluid-1 pl-fluid-2">
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
          <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
          <li>
            Kişisel verilerinizin işlenme amacını ve bunların amacına uygun
            kullanılıp kullanılmadığını öğrenme,
          </li>
          <li>
            Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı
            üçüncü kişileri bilme,
          </li>
          <li>
            Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde
            bunların düzeltilmesini isteme ve bu kapsamda yapılan işlemin
            kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini
            isteme,
          </li>
          <li>
            KVKK ve ilgili diğer kanun hükümlerine uygun olarak işlenmiş
            olmasına rağmen işlenmesini gerektiren sebeplerin ortadan kalkması
            hâlinde kişisel verilerinizin silinmesini veya yok edilmesini isteme
            ve bu kapsamda yapılan işlemin üçüncü kişilere bildirilmesini
            isteme,
          </li>
          <li>
            İşlenen verilerinizin münhasıran otomatik sistemler vasıtasıyla
            analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına
            itiraz etme,
          </li>
          <li>
            Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle
            zarara uğraması hâlinde zararınızın giderilmesini talep etme
          </li>
        </ul>
        <p className="mt-3">haklarına sahipsiniz.</p>
      </>
    ),
  },
  {
    id: "VI",
    title: "Veri Sahibi Olarak Haklarınızı Ne Şekilde Kullanacaksınız?",
    content: (
      <p>
        KVKK madde 11 uyarınca sahip olduğunuz haklarınızı kullanmak için{" "}
        <Link
          href="/iletisim"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          iletişim formumuzu
        </Link>{" "}
        doldurarak veya{" "}
        <a
          href="mailto:info@sultanokullari.com"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          info@sultanokullari.com
        </a>{" "}
        adresine e-posta göndererek ya da Sultan Okulları&#39;na şahsen başvuru
        ile ya da iadeli taahhütlü posta yoluyla tarafımıza iletebilirsiniz.
        Sultan Okulları, talebin niteliğine göre talebi en kısa sürede ve en geç
        otuz (30) gün içerisinde ücretsiz olarak sonuçlandıracaktır. Ancak
        işlemin ayrıca bir maliyeti gerektirmesi hâlinde Kişisel Verileri Koruma
        Kurulu tarafından belirlenen tarifedeki ücreti alma hakkımız saklıdır.
        Kişisel verilerinizle ilgili değişiklik ve/veya güncellemeleri her zaman
        yukarıda belirtilen iletişim yollarıyla bize bildirebilirsiniz.
      </p>
    ),
  },
  {
    id: "VII",
    title: "Kişisel Verileriniz Ne Süreyle İşlenecektir?",
    content: (
      <p>
        KVKK&#39;ya uygun olarak, işbu Aydınlatma Metninde belirtilen amaçlarla
        işlenmiş olan kişisel verileriniz, KVKK 7. maddesinin 1. fıkrasına göre
        işlenmesini gerektiren amaç ortadan kalktığında ve/veya mevzuat uyarınca
        verilerinizi işlememiz için zorunlu kılındığımız zamanaşımı süreleri
        dolduğunda tarafımızca silinecek, yok edilecek veya anonimleştirilerek
        kullanılmaya devam edilecektir.
      </p>
    ),
  },
  {
    id: "VIII",
    title: "KVKK'nın Yürürlük Tarihinden Önce Alınan Kişisel Verileriniz",
    content: (
      <p>
        KVKK&#39;nın yürürlük tarihi olan 7 Nisan 2016 tarihinden önce hukuka
        uygun olarak elde edilmiş olan kişisel verileriniz, işbu Aydınlatma
        Metninde ve KVKK&#39;da düzenlenen şart ve koşullara uygun olarak
        işlenebilecek ve muhafaza edilebilecek olup Türkiye&#39;de işlenerek
        veya Türkiye dışında işlenip muhafaza edilmek üzere yurt dışına da
        aktarılabilecektir.
      </p>
    ),
  },
];

export default function Page() {
  return (
    <PageShell
      title="Kişisel Verilerin Korunması ve İşlenmesine İlişkin Aydınlatma Metni"
      intro="Sultan Okulları olarak 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca veri sorumlusu sıfatıyla kişisel verilerinizi hangi kapsamda işlediğimizi aşağıda açıklamaktayız."
    >
      <div className="mt-fluid-2 space-y-fluid-8">
        {sections.map((section) => (
          <section key={section.id} id={`bolum-${section.id.toLowerCase()}`}>
            <h2 className="flex items-baseline gap-fluid-2 text-[length:var(--text-base)] font-semibold text-zinc-900 md:text-[length:var(--text-lg)]">
              <span className="shrink-0 text-[length:var(--text-xs)] font-bold tracking-widest text-[var(--color-primary)] uppercase">
                {section.id}.
              </span>
              {section.title}
            </h2>
            <div className="mt-fluid-3 text-[length:var(--text-sm)] leading-7 text-zinc-700 md:text-[length:var(--text-base)]">
              {section.content}
            </div>
          </section>
        ))}

        <div className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary-light)]/40 p-fluid-4 md:p-fluid-6">
          <p className="text-[length:var(--text-xs)] font-semibold tracking-widest text-[var(--color-primary)] uppercase">
            Veri Sorumlusu
          </p>
          <p className="mt-fluid-2 text-[length:var(--text-sm)] leading-6 text-zinc-800">
            <strong>Sultan Okulları</strong> — Sorularınız veya başvurularınız
            için{" "}
            <Link
              href="/iletisim"
              className="font-medium text-[var(--color-primary)] hover:underline"
            >
              iletişim sayfamızı
            </Link>{" "}
            ziyaret edebilir ya da{" "}
            <a
              href="mailto:info@sultanokullari.com"
              className="font-medium text-[var(--color-primary)] hover:underline"
            >
              info@sultanokullari.com
            </a>{" "}
            adresine e-posta gönderebilirsiniz.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
