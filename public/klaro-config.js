// Define Klaro configuration under the global klaroConfig variable
window.klaroConfig = {
    version: 2, // Klaro config version (always set this to 2 for current Klaro releases)

    // ID of the DOM element Klaro should attach to (usually an empty <div id="klaro"></div>)
    elementID: 'klaro',

    // Klaro will use cookies to store consent information
    storageMethod: 'cookie',

    // Name of the cookie used to store user consent
    cookieName: 'klaro-i18n',

    // Optional: Link to your privacy policy
    privacyPolicy: '/privacy',

    // Default consent value (true = all services enabled unless user opts out)
    default: false, // Default to false: no services are enabled unless user consents

    // Whether to suppress the consent notice entirely (not recommended)
    noNotice: false,

    // If true, user must consent before services can run
    mustConsent: false,

    // Shows an "Accept All" button
    acceptAll: true,

    // Hides the "Decline All" button (set to false to show it)
    hideDeclineAll: false,

    // Optional footer text in the modal
    poweredBy: 'https://github.com/KIProtect/klaro/blob/master/dist/configs/i18n.js',

    // Services that Klaro manages consent for
    services: [
      {
        name: 'essentialCookies',
        title: 'Essential Cookies',
        purposes: ['essential'],
        description: 'These cookies are necessary for the website to function properly, including remembering your theme preferences.',
        default: true,
        required: true,
        cookies: [
          'themeMode',
          'themePaletteIndex'
        ],
      },
      {
        name: 'tally', // Internal identifier
        title: 'Tally Contact Form', // Display name
        purposes: ['functional'], // Categorized as "functional"
        cookies: [], // No cookies are tracked
        required: false, // User can disable it
        optOut: false, // Not pre-enabled unless default is true
        onlyOnce: true, // Only load service once after consent
      },
      {
        name: 'norton',
        title: 'Norton Form Protection',
        purposes: ['functional'],
        default: true, // Pre-enabled on first load
        required: false,
        cookies: [], // No cookies listed
      },

    ],


    // Translations: Customize modal and service text in different languages
    translations: {
      en: {
        consentModal: {
          title: 'Privacy Preferences',
          description:
            'We use a privacy-friendly form service (Tally) to collect contact information. Form submissions are securely processed by Norton. You can manage your preferences below.',
        },
        purposes: {
          essential: 'Essential Cookies',
          functional: 'Functional Services',
        },
        services: {
          essentialCookies: {
            description: 'These cookies remember your theme preferences and are necessary for the website to function properly.',
          },
          tally: {
            description: 'Handles form submissions. No tracking cookies are used.',
          },
          norton: {
            description: 'Processes form data securely for spam protection and integrity.',
          },
        },
      },
      es: {
        consentModal: {
          title: 'Preferencias de privacidad',
          description:
            'Usamos Tally para recopilar información de contacto de manera respetuosa con la privacidad. Norton procesa los formularios de forma segura. Puedes gestionar tus preferencias a continuación.',
        },
        purposes: {
          functional: 'Servicios esenciales',
        },
        services: {
          tally: {
            description: 'Gestiona envíos de formularios. No se utilizan cookies de seguimiento.',
          },
          norton: {
            description: 'Procesa datos de formularios de forma segura para proteger contra spam.',
          },
        },
      },
      hi: {
        consentModal: {
          title: 'गोपनीयता प्राथमिकताएं',
          description:
            'हम संपर्क जानकारी एकत्र करने के लिए Tally का उपयोग करते हैं। Norton आपके फ़ॉर्म डेटा को सुरक्षित रूप से प्रोसेस करता है। आप नीचे अपनी प्राथमिकताएं प्रबंधित कर सकते हैं।',
        },
        purposes: {
          functional: 'आवश्यक सेवाएं',
        },
        services: {
          tally: {
            description: 'फ़ॉर्म सबमिशन संभालता है। कोई ट्रैकिंग कुकीज़ उपयोग नहीं की जातीं।',
          },
          norton: {
            description: 'स्पैम सुरक्षा के लिए फ़ॉर्म डेटा को सुरक्षित रूप से प्रोसेस करता है।',
          },
        },
      },
    },
    /*
    You can define an optional callback function that will be called each time the
    consent state for any given service changes. The consent value will be passed as
    the first parameter to the function (true=consented). The `service` config will
    be passed as the second parameter.
    */
    callback: function(consent, service) {
        // console.log(
        //     'User consent for service ' + service.name + ': consent=' + consent
        // );
    },
  };
