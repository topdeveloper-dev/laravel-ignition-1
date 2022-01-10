import React, { useContext, useState } from 'react';
import NavBarItem from 'components/NavBarItem';
import ShareDropdown from 'components/ShareDropdown';
import SettingsDropdown from 'components/SettingsDropdown';
import { ErrorOccurrenceContext, hasDebugInfo } from '@flareapp/ignition-ui';
import useHasScrolled from 'hooks/useHasScrolled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFingerprint, faCode, faBug, faShare, faCog } from '@fortawesome/free-solid-svg-icons';
import { faLaravel } from '@fortawesome/free-brands-svg-icons';

type Props = { showException: boolean };

export default function NavBar({ showException }: Props) {
    const errorOccurrence = useContext(ErrorOccurrenceContext);
    const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
    const hasScrolled = useHasScrolled({ distance: 10 });

    const laravelDocs = errorOccurrence.documentation_links.find(link => link.startsWith('https://laravel.com/'));

    function toggleShare() {
        setIsSettingsDropdownOpen(false);
        setIsShareDropdownOpen(!isShareDropdownOpen);
    }

    function toggleSettings() {
        setIsShareDropdownOpen(false);
        setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
    }

    return (
        <nav className="z-50 fixed top-0 h-20 w-full">
            <div className="relative">
                <div
                    className={`
                        ${hasScrolled ? '~bg-gray-100' : '~bg-body'}
                        z-10 transform translate-x-0 transition-color duration-100
                    `}
                >
                    <div className="h-10 flex justify-between px-6 lg:px-10 mx-auto max-w-4xl lg:max-w-[90rem]">
                        <ul className="-ml-3 sm:-ml-5 grid grid-flow-col justify-start items-center">
                            <NavBarItem name="stack" icon={
                                <FontAwesomeIcon icon={faCode} />
                            } />
                            <NavBarItem name="context" icon={
                                <FontAwesomeIcon icon={faFingerprint} />
                            } />
                            {hasDebugInfo(errorOccurrence) && (
                                <NavBarItem
                                    name="debug"
                                    icon={
                                        <FontAwesomeIcon icon={faBug} />
                                    }
                                    important={!!errorOccurrence.context_items.dumps.length}
                                />
                            )}
                            <NavBarItem name="share" icon={
                                <FontAwesomeIcon icon={faShare} />
                            } onClick={toggleShare}>
                                <ShareDropdown isOpen={isShareDropdownOpen} />
                            </NavBarItem>
                        </ul>
                        <ul className="-mr-3 sm:-mr-5 grid grid-flow-col justify-end items-center">
                            <NavBarItem name="docs" href={laravelDocs || 'https://laravel.com/docs/'} icon={
                                <FontAwesomeIcon className='text-sm' icon={faLaravel} />
                            } important={!!laravelDocs} />
                            <NavBarItem name="settings" icon={
                                <FontAwesomeIcon className='text-sm' icon={faCog} />
                            } label={false} onClick={toggleSettings}>
                                <SettingsDropdown isOpen={isSettingsDropdownOpen} />
                            </NavBarItem>

                            {/* <li class="flex items-center">
                  <button class="group px-3 sm:px-5 h-10 uppercase tracking-wider text-xs font-medium">
                      <i class="mr-1 fab fa-github ~text-gray-500 group-hover:text-red-500"></i>
                      GitHub
                  </button>
              </li> */}
                        </ul>
                    </div>
                </div>

                <div
                    className={`
                        ${hasScrolled ? 'shadow-lg' : ''}
                        ${showException ? 'translate-y-10 ~bg-gray-100' : 'translate-y-0 ~bg-body'}
                        absolute top-0 left-0 w-full
                        ~bg-gray-100 border-b ~border-gray-200
                        transform
                        transition-animation
                        duration-300
                    `}
                >
                    <div
                        className="
                        px-6 lg:px-10 mx-auto max-w-4xl lg:max-w-[90rem]
                        h-10 flex items-center justify-start
                        border-t ~border-gray-200"
                    >
                        <div className="font-semibold min-w-0 truncate">
                            <a href="#top" className="hover:text-red-500">
                                {errorOccurrence.exception_message}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
