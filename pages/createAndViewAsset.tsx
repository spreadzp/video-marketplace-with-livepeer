import { Player, useAssetMetrics, useCreateAsset, getAsset } from '@livepeer/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ProgressBar from './progressbar';

type CreateAndViewAssetProps = {
    setPlaybackId: any
}
export default function CreateAndViewAsset({ setPlaybackId }: CreateAndViewAssetProps) {
    const [video, setVideo] = useState<File | undefined>();
    const [base64FileData, setBase64FileData] = useState('')
    const [encodedVideo, setEncodedVideo] = useState<File | undefined>(); 

    /// it saved file but it returns object with error for example
    /// const res = await getAsset("686cc186-dd3f-4294-be3f-9e944fa615ff") =>
    /// GET "https://livepeer.studio/api/asset/686cc186-dd3f-4294-be3f-9e944fa615ff
    // {
    //     "id": "686cc186-dd3f-4294-be3f-9e944fa615ff",
    //     "name": "encoded-video.mp4",
    //     "source": {
    //         "type": "directUpload"
    //     },
    //     "status": {
    //         "phase": "failed",
    //         "updatedAt": 1680612078700,
    //         "errorMessage": "invalid video file codec or container, check your input file against the input codec and container support matrix"
    //     },
    //     "userId": "e217408e-574d-46da-8a5c-959e084cc8ea",
    //     "createdAt": 1680612057890,
    //     "playbackId": "686cuii4jkmbicps"
    // }

    const {
        mutate: createAsset,
        data: assets,
        status,
        progress,
        error,
    } = useCreateAsset(
        encodedVideo
            ? {
                sources: [
                    {
                        name: encodedVideo.name,
                        file: encodedVideo,
                        storage: {
                            ipfs: true,
                            metadata: {
                                name: 'interesting video',
                                description: 'a great description of the video',
                            },
                        },
                    },
                ] as const,
            }
            : null,
    );  
  
    /// here need implement encoding to save to Livepeer as encoded.txt
    // useEffect(() => {
    //     if (base64FileData) {
    //         const arrayBuffer = Buffer?.from(base64FileData.split(',')[1]);
    //         const blob = new Blob([arrayBuffer], { type: 'video/mp4' });
    //         const file = new File([blob], 'encoded-video.mp4', { type: 'video/mp4' });
    //         setEncodedVideo(file);
    //     }
    // }, [base64FileData]);

    const { data: metrics } = useAssetMetrics({
        assetId: assets?.[0].id,
        refetchInterval: 30000,
    });

    const isLoading = useMemo(
        () =>
            status === 'loading'
            ||
            (assets?.[0] && assets[0].status?.phase !== 'ready'),
        [status, assets],
    );

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        console.log("🚀 ~ file: createAndViewAsset.tsx:40 ~ onDrop ~ acceptedFiles", acceptedFiles)
        if (acceptedFiles && acceptedFiles.length > 0 && acceptedFiles?.[0]) {
            await createImage(acceptedFiles[0])
            setVideo(acceptedFiles[0]);
        }
    }, []);

    const createImage = async (file: any) => {
        const reader = new FileReader()
        // eslint-disable-next-line
        reader.onload = async (e: any) => {
            // this.image = e.target.result
            const res = await reader.result?.toString()
            if (res) {
                setBase64FileData(res)
                // setTypeFile(defineTypeFile(res)) 
            }
        }
        reader.readAsDataURL(file)
    }

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'video/*': ['*.mp4'],
        },
        maxFiles: 1,
        onDrop
    });

    const progressFormatted = useMemo(
        () =>
            progress?.[0].phase === 'failed'
                ? 'Failed to process video.'
                : progress?.[0].phase === 'waiting'
                    ? 'Waiting'
                    : progress?.[0].phase === 'uploading'
                        ? `Uploading: ${Math.round(progress?.[0]?.progress * 100)}%`
                        : progress?.[0].phase === 'processing'
                            ? `Processing: ${Math.round(progress?.[0].progress * 100)}%`
                            : null,
        [progress],
    );

    // the case for playbackId
    // useEffect(() => {
    //     console.log("🚀 ~ file: createAndViewAsset.tsx:120 ~ useEffect ~ asset:", assets)
    //     if (assets && assets[0]?.playbackId) {

    //         setPlaybackId(assets[0]?.playbackId)
    //     }
    // }, [assets]);

    useEffect(() => {
        setPlaybackId(base64FileData)
    }, [base64FileData]);

    return (
        <>  
            {metrics?.metrics?.[0] && (
                <div>Views: {metrics?.metrics?.[0]?.startViews}</div>
            )}
            {video ? (
                <div className="block mb-2 mt-2 text-sm font-medium text-white dark:text-white">Video file name: {video.name}</div>
            ) : (
                <div {...getRootProps}>
                    <label className="block mb-2 text-sm font-medium text-white dark:text-white" htmlFor="file_input">Select a video file to upload.</label>
                    <input name="file_input"
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600
             dark:placeholder-gray-400" aria-describedby="file_input_help block"   {...getInputProps()} style={{ "display": "block" }} />

                </div>
            )}
            {/* {assets?.map((asset) => (
                <div key={asset.id}>
                    <div>
                        <div>Asset Name: {asset?.name}</div>
                        <div>Playback URL: {asset?.playbackUrl}</div>
                        <div>IPFS CID: {asset?.storage?.ipfs?.cid ?? 'None'}</div>
                    </div>
                </div>
            ))} */} 
 
            {error && <p>{error.message}</p>}
            <div className="m-10">
                {progressFormatted &&
                    progress?.[0].phase === 'uploading' &&
                    <ProgressBar progressPercentage={Math.round(progress?.[0]?.progress * 100)} processName={progress?.[0].phase} />}

                {progressFormatted &&
                    progress?.[0].phase === 'processing' &&
                    <ProgressBar progressPercentage={Math.round(progress?.[0]?.progress * 100)} processName={progress?.[0].phase} />}
            </div>

            {base64FileData && (
                <div className='h-25 w-25'>
                    <Player title={video?.name}
                        src={base64FileData}
                        // src={'https://ipfs.livepeer.studio/ipfs/QmURv3J5BGsz23GaCUm7oXncm2M9SCj8RQDuFPGzAFSJw8'}
                        // playbackId={asset[0].playbackId  }  
                        theme={{
                            borderStyles: {
                                containerBorderStyle: 'dotted',
                            },
                            colors: {
                                accent: '#00a55f',
                            },
                            sizes: {
                                trackContainerHeight: '50px',
                                thumb: 50
                            },
                            space: {
                                controlsBottomMarginX: '10px',
                                controlsBottomMarginY: '5px',
                                controlsTopMarginX: '15px',
                                controlsTopMarginY: '10px',
                            },
                            radii: {
                                containerBorderRadius: '0px',
                            },  
                        }} />

                </div>
            )}
            {/*
            
            {video && status !== 'success' && <div className="">
                <button
                    onClick={() => {
                        createAsset?.();
                    }}
                    className={`h-full mt-2   rounded-2xl w-full ${createAsset ? 'bg-red-600' : 'bg-transparent'}`}
                    disabled={!createAsset || status === 'loading'}
                >
                    {!isLoading ? 'Upload the file via LivePeer' : 'Uploading...'}
                </button>
            </div>} */}
        </>
    );
};
