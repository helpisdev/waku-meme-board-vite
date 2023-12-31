import * as Form from '@radix-ui/react-form';
import { LightNode } from '@waku/interfaces';
import { useLightPush } from '@waku/react';
import { Encoder } from '@waku/sdk';
import type React from 'react';
import { useCallback } from 'react';

import { AddMemeCallback } from '../../types/type';
import { isAcceptedMemeFormatMime, MemeMessage, mimeToFormatMapping } from '../../util';

interface Props {
  readonly node: LightNode | undefined;
  readonly encoder: Encoder;
  readonly addMeme: AddMemeCallback;
  readonly uploadingMeme: (uploading: boolean) => void;
}
export default function MemeUploader({
  node,
  encoder,
  addMeme,
  uploadingMeme,
}: Props): React.ReactNode {
  const { push } = useLightPush({ node, encoder });

  const handler = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      uploadingMeme(true);
      e.preventDefault();
      const meme: HTMLElement | null = document.getElementById('uploader');

      try {
        if (meme && push) {
          const memes = (meme as HTMLInputElement).files;

          if (memes) {
            for (const m of memes) {
              const memeData = new Uint8Array(await m.arrayBuffer());
              const cid = await addMeme(memeData);

              if (cid) {
                const mime = m.type;
                if (isAcceptedMemeFormatMime(mime)) {
                  await push({
                    payload: MemeMessage.encode(
                      MemeMessage.create({
                        timestamp: Date.now(),
                        hash: cid.toString(),
                        format: mimeToFormatMapping[mime].valueOf(),
                      }),
                    ).finish(),
                  });
                }
              }
            }
          }
        }
      } catch (err) {
        console.error(err);
      }

      uploadingMeme(false);
    },
    [push, addMeme, uploadingMeme],
  );

  return (
    <div className='px-6 pb-20 text-center'>
      <Form.Root className='mx-auto block max-w-sm rounded-lg border-2 border-subtle-borders-and-seperators bg-app p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:border-subtle-borders-and-seperators-dark dark:bg-app-dark'>
        <Form.Field className='' name='meme'>
          <div className='mb-3'>
            <Form.Label className='mb-2 inline-block text-high-contrast dark:text-high-contrast-dark'>
              Choose an image:
            </Form.Label>

            <Form.Message match='valueMissing'>Please select an image</Form.Message>

            <Form.Message match='typeMismatch'>
              Please select an image with a format of jpeg, jpg, png, or gif
            </Form.Message>
          </div>

          <Form.Control asChild>
            <input
              accept='.jpg, .png, .jpeg, .gif'
              className='focus:border-primary
                      focus:shadow-te-primary
                      dark:focus:border-primary
                      relative
                      m-0
                      block
                      w-full
                      min-w-0
                      flex-auto
                      rounded
                      border
                      border-ui-el-borders-and-focus-rings
                      bg-clip-padding
                      px-3
                      py-[0.32rem]
                      text-base
                      font-normal
                      text-high-contrast
                      transition
                      duration-300
                      ease-in-out
                      file:mx-3
                      file:my-[0.32rem]
                      file:overflow-hidden
                      file:rounded-none
                      file:border-0
                      file:border-solid
                      file:bg-ui-el
                      file:px-3
                      file:py-[0.32rem]
                      file:text-high-contrast
                      file:transition
                      file:duration-150

                      file:ease-in-out
                      file:[border-inline-end-width:1px]
                      file:[margin-inline-end:0.75rem]
                      hover:file:bg-hovered-ui-el
                      focus:text-high-contrast
                      focus:outline-none

                      dark:border-ui-el-borders-and-focus-rings-dark
                      dark:text-high-contrast-dark
                      dark:file:bg-ui-el-dark
                      dark:file:text-high-contrast-dark
                      hover:dark:file:bg-hovered-ui-el-dark
                      focus:dark:text-high-contrast-dark
'
              id='uploader'
              required
              type='file'
            />
          </Form.Control>
        </Form.Field>

        <Form.Submit asChild>
          <button
            className='
        dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]]
        mt-2.5
        inline-block
        w-full
        rounded
        bg-solid
        py-2
        text-lg
        font-medium
        leading-normal
        text-high-contrast
        shadow-[0_4px_9px_-4px_#3b71ca]
        transition
        duration-150
        ease-in-out
        hover:bg-hovered-solid
        hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]
        focus:bg-hovered-solid
        focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]
        focus:outline-none
        focus:ring-0
        active:bg-hovered-solid
        active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]
        dark:bg-solid-dark
        dark:text-high-contrast-dark
        dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)]
        dark:hover:bg-hovered-solid-dark
        dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]
        dark:focus:bg-hovered-solid-dark
        dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]
        dark:active:bg-hovered-solid-dark
        '
            data-te-ripple-color='light'
            data-te-ripple-init
            onClick={handler}
            type='submit'
          >
            Post a Meme!
          </button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
}
