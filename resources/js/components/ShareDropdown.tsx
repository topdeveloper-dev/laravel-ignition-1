import React, { useContext, useState } from 'react';
import { Button, FlareIcon } from '@flareapp/ignition-ui';
import Checkbox from 'components/ui/Checkbox';
import { IgniteDataContext } from '../contexts/IgniteDataContext';
import CopyableUrl from './ui/CopyableUrl';

type Props = {
    isOpen: boolean;
};

type SectionName = 'stackTrace' | 'context' | 'debug';

export default function ShareDropdown({ isOpen }: Props) {
    const igniteData = useContext(IgniteDataContext);
    const [ownerUrl, setOwnerUrl] = useState<string | null>(null);
    const [publicUrl, setPublicUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedTabs, setSelectedTabs] = useState<Array<{ name: SectionName; label: string; selected: boolean }>>([
        { name: 'stackTrace', label: 'Stack', selected: true },
        { name: 'context', label: 'Context', selected: true },
        { name: 'debug', label: 'Debug', selected: true },
    ]);

    function toggleSelected(tabName: SectionName) {
        const tab = selectedTabs.find((tab) => tab.name === tabName);

        if (tab) {
            setSelectedTabs(
                selectedTabs.map((tab) => (tab.name === tabName ? { ...tab, selected: !tab.selected } : tab)),
            );
        }
    }

    async function onShareError() {
        if (!igniteData.config.shareEndpoint) {
            return;
        }

        const selectedTabNames = selectedTabs
            .filter((selectedTab) => selectedTab.selected)
            .map((selectedTab) => selectedTab.name);

        const data = {
            selectedTabNames,
            tabs: selectedTabNames,
            lineSelection: window.location.hash,
            report: igniteData.shareableReport,
        };

        setIsLoading(true);

        try {
            const response = await (
                await fetch(igniteData.config.shareEndpoint, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                })
            ).json();

            if (response && response.owner_url && response.public_url) {
                setOwnerUrl(response.owner_url);
                setPublicUrl(response.public_url);
            }
        } catch (error) {
            setError('Something went wrong while sharing, please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div
            className={`block absolute mt-2 top-10 left-1/2 transform -translate-x-6 transition-all duration-150 origin-top-left
                 ${isOpen ? '' : 'opacity-0 pointer-events-none scale-90'}`}
        >
            <div className="flex px-4 justify-start">
                <div className="w-0 h-0 border-[10px] border-t-0 border-transparent ~border-b-dropdown" />
            </div>
            <div className="flex flex-col gap-6 ~bg-dropdown px-10 py-8 shadow-2xl">
                <div className="flex items-center justify-between gap-6">
                    <h4 className="whitespace-nowrap font-semibold">Share with Flare</h4>
                    <a
                        className="text-xs ~text-gray-500 hover:text-violet-500 flex items-center underline transition-colors"
                        href="https://flareapp.io/docs/ignition-for-laravel/sharing-errors"
                        target="_blank"
                    >
                        Docs
                        <FlareIcon />
                    </a>
                </div>
                {!publicUrl && (
                    <>
                        <ul className="grid justify-start gap-3">
                            {selectedTabs.map(({ selected, name, label }) => (
                                <li key={name}>
                                    <Checkbox onChange={() => toggleSelected(name)} checked={selected} label={label} />
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center gap-4">
                            <Button
                                disabled={isLoading}
                                className={'bg-violet-500 border-violet-500/25 CopyButton text-white'}
                                onClick={onShareError}
                            >
                                Create Share
                            </Button>
                        </div>
                    </>
                )}

                {publicUrl && ownerUrl && (
                    <div>
                        <CopyableUrl
                            url={publicUrl}
                            helpText="Share your error with others:"
                            openText="Open public share"
                        />
                        <CopyableUrl
                            url={ownerUrl}
                            helpText="Administer your shared error here:"
                            openText="Open share admin"
                        />
                    </div>
                )}

                {error && <p className="text-red-500">{error}</p>}
            </div>
        </div>
    );
}
