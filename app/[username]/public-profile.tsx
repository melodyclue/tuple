import type { SelectLink, SelectProfile } from '@/db/schema';
import { LinkIconMap } from '@/feature/links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import parse from 'html-react-parser';

export const PublicProfile = ({ data }: { data: SelectProfile & { links: SelectLink[] } }) => {
  return (
    <div className="motion-safe:animate-fadeInSlow p-8">
      <div className="mx-auto w-full max-w-screen-md">
        <div className="space-y-4">
          <div>
            {data.imageUrl ? (
              <div className="flex items-end gap-3">
                <div className="h-24 w-24 overflow-hidden rounded-full border">
                  <Image
                    src={data.imageUrl}
                    alt={data.username}
                    className="h-full w-full object-cover"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            ) : (
              <div className="h-24 w-24 rounded-full border-orange-200 bg-orange-200">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full text-white">
                  <span className="text-3xl font-semibold">{data.username.charAt(0).toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
          <h1 className="block p-2 text-4xl font-bold">{data.name}</h1>
          <div className="rounded-md p-2 text-slate-800">{parse(data.bio ?? '')}</div>
        </div>
        <div className="mt-8 w-full">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col flex-wrap gap-3">
              {data.links.map((link) => {
                const icon = LinkIconMap[link.type];
                return (
                  <a
                    target="_blank"
                    rel="noreferrer noopener"
                    title={link.title}
                    aria-label={link.title}
                    key={link.id}
                    href={link.url}
                    className="flex flex-1 items-center gap-4 rounded-md bg-orange-100 px-4 py-2 text-slate-900"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white p-1">
                      <FontAwesomeIcon icon={icon} className="h-5 w-5 text-slate-700" />
                    </div>
                    {link.title}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
