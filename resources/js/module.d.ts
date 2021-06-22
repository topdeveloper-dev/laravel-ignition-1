interface Window {
    flare?: typeof import('@flareapp/flare-client').flare;
    ignite: (data: import('resources/js/shared/types').IgniteData) => void;
    shareableReport?: import('resources/js/shared/types').IgniteData['shareableReport'];
}
