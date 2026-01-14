import React, { useState, useRef } from 'react'
import Navbar from './Navbar'
import { Button } from './ui/button'
import { uploadToIPFS } from '../lib/ipfs'
import { Loader2 } from 'lucide-react'

const Test = () => {
    const [uploading, setUploading] = useState(false);
    const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            setError(null);
            setIpfsUrl(null);

            // Upload to IPFS
            const url = await uploadToIPFS(file);
            setIpfsUrl(url);
            console.log("Uploaded to IPFS:", url);
        } catch (err: any) {
            console.error("Upload failed:", err);
            setError(err.message || "Failed to upload image.");
        } finally {
            setUploading(false);
            // Reset input so the same file can be selected again if needed
            event.target.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className='flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-6 p-4'>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <Button
                    onClick={handleButtonClick}
                    disabled={uploading}
                    className="w-48"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        'Select & Send Image'
                    )}
                </Button>

                {error && (
                    <div className="text-red-500 font-medium">
                        {error}
                    </div>
                )}

                {ipfsUrl && (
                    <div className="flex flex-col items-center gap-2 max-w-xl text-center break-all">
                        <p className="text-green-500 font-medium">Image uploaded successfully!</p>
                        <p className="text-muted-foreground text-sm font-mono bg-muted p-2 rounded">
                            {ipfsUrl}
                        </p>
                        <a
                            href={ipfsUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                        >
                            View on Gateway
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Test