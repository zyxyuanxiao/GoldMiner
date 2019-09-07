
/**
 *  音频处理插件 
 */    
class Sonic {

    private static   SONIC_MIN_PITCH :number= 65;
    private static   SONIC_MAX_PITCH :number = 400;
    // This is used to down-sample some inputs to improve speed
    private static   SONIC_AMDF_FREQ :number = 4000;
    // The number of points to use in the sinc FIR filter for resampling.
    private static   SINC_FILTER_POINTS :number = 12;
    private static   SINC_TABLE_SIZE :number = 601;

    //modify by yann 
    private static SHORT_MIN :number = -32768;
    private static SHORT_MAX :number = 32767;

    private static BYTE_MIN :number = -128;
    private static BYTE_MAX :number = 127;



    // Lookup table for windowed sinc function of SINC_FILTER_POINTS points.
    private static   sincTable: number[] = [
        0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -2, -3, -4, -6, -7, -9, -10, -12, -14,
        -17, -19, -21, -24, -26, -29, -32, -34, -37, -40, -42, -44, -47, -48, -50,
        -51, -52, -53, -53, -53, -52, -50, -48, -46, -43, -39, -34, -29, -22, -16,
        -8, 0, 9, 19, 29, 41, 53, 65, 79, 92, 107, 121, 137, 152, 168, 184, 200,
        215, 231, 247, 262, 276, 291, 304, 317, 328, 339, 348, 357, 363, 369, 372,
        374, 375, 373, 369, 363, 355, 345, 332, 318, 300, 281, 259, 234, 208, 178,
        147, 113, 77, 39, 0, -41, -85, -130, -177, -225, -274, -324, -375, -426,
        -478, -530, -581, -632, -682, -731, -779, -825, -870, -912, -951, -989,
        -1023, -1053, -1080, -1104, -1123, -1138, -1149, -1154, -1155, -1151,
        -1141, -1125, -1105, -1078, -1046, -1007, -963, -913, -857, -796, -728,
        -655, -576, -492, -403, -309, -210, -107, 0, 111, 225, 342, 462, 584, 708,
        833, 958, 1084, 1209, 1333, 1455, 1575, 1693, 1807, 1916, 2022, 2122, 2216,
        2304, 2384, 2457, 2522, 2579, 2625, 2663, 2689, 2706, 2711, 2705, 2687,
        2657, 2614, 2559, 2491, 2411, 2317, 2211, 2092, 1960, 1815, 1658, 1489,
        1308, 1115, 912, 698, 474, 241, 0, -249, -506, -769, -1037, -1310, -1586,
        -1864, -2144, -2424, -2703, -2980, -3254, -3523, -3787, -4043, -4291,
        -4529, -4757, -4972, -5174, -5360, -5531, -5685, -5819, -5935, -6029,
        -6101, -6150, -6175, -6175, -6149, -6096, -6015, -5905, -5767, -5599,
        -5401, -5172, -4912, -4621, -4298, -3944, -3558, -3141, -2693, -2214,
        -1705, -1166, -597, 0, 625, 1277, 1955, 2658, 3386, 4135, 4906, 5697, 6506,
        7332, 8173, 9027, 9893, 10769, 11654, 12544, 13439, 14335, 15232, 16128,
        17019, 17904, 18782, 19649, 20504, 21345, 22170, 22977, 23763, 24527,
        25268, 25982, 26669, 27327, 27953, 28547, 29107, 29632, 30119, 30569,
        30979, 31349, 31678, 31964, 32208, 32408, 32565, 32677, 32744, 32767,
        32744, 32677, 32565, 32408, 32208, 31964, 31678, 31349, 30979, 30569,
        30119, 29632, 29107, 28547, 27953, 27327, 26669, 25982, 25268, 24527,
        23763, 22977, 22170, 21345, 20504, 19649, 18782, 17904, 17019, 16128,
        15232, 14335, 13439, 12544, 11654, 10769, 9893, 9027, 8173, 7332, 6506,
        5697, 4906, 4135, 3386, 2658, 1955, 1277, 625, 0, -597, -1166, -1705,
        -2214, -2693, -3141, -3558, -3944, -4298, -4621, -4912, -5172, -5401,
        -5599, -5767, -5905, -6015, -6096, -6149, -6175, -6175, -6150, -6101,
        -6029, -5935, -5819, -5685, -5531, -5360, -5174, -4972, -4757, -4529,
        -4291, -4043, -3787, -3523, -3254, -2980, -2703, -2424, -2144, -1864,
        -1586, -1310, -1037, -769, -506, -249, 0, 241, 474, 698, 912, 1115, 1308,
        1489, 1658, 1815, 1960, 2092, 2211, 2317, 2411, 2491, 2559, 2614, 2657,
        2687, 2705, 2711, 2706, 2689, 2663, 2625, 2579, 2522, 2457, 2384, 2304,
        2216, 2122, 2022, 1916, 1807, 1693, 1575, 1455, 1333, 1209, 1084, 958, 833,
        708, 584, 462, 342, 225, 111, 0, -107, -210, -309, -403, -492, -576, -655,
        -728, -796, -857, -913, -963, -1007, -1046, -1078, -1105, -1125, -1141,
        -1151, -1155, -1154, -1149, -1138, -1123, -1104, -1080, -1053, -1023, -989,
        -951, -912, -870, -825, -779, -731, -682, -632, -581, -530, -478, -426,
        -375, -324, -274, -225, -177, -130, -85, -41, 0, 39, 77, 113, 147, 178,
        208, 234, 259, 281, 300, 318, 332, 345, 355, 363, 369, 373, 375, 374, 372,
        369, 363, 357, 348, 339, 328, 317, 304, 291, 276, 262, 247, 231, 215, 200,
        184, 168, 152, 137, 121, 107, 92, 79, 65, 53, 41, 29, 19, 9, 0, -8, -16,
        -22, -29, -34, -39, -43, -46, -48, -50, -52, -53, -53, -53, -52, -51, -50,
        -48, -47, -44, -42, -40, -37, -34, -32, -29, -26, -24, -21, -19, -17, -14,
        -12, -10, -9, -7, -6, -4, -3, -2, -2, -1, -1, 0, 0, 0, 0, 0, 0, 0
    ];
    
    private inputBuffer:Int16Array  //private short inputBuffer[];
    private  outputBuffer:Int16Array ;  //private short outputBuffer[];
    private pitchBuffer:Int16Array;
    private  downSampleBuffer:Int16Array;
    //float
    private  speed :number= 0;
    private  volume:number= 0;
    private  pitch:number= 0;
    private  rate:number= 0;
    private  oldRatePosition:number= 0;
    private  newRatePosition:number= 0;  
    private  quality:number= 0;
    private  numChannels:number= 0;
    private  inputBufferSize:number= 0;
    private  pitchBufferSize:number= 0;
    private  outputBufferSize:number= 0;
    private  numInputSamples:number = 0;
    private  numOutputSamples:number= 0;
    private  numPitchSamples:number = 0;
    private  minPeriod:number= 0;
    private  maxPeriod:number= 0;
    private  maxRequired:number= 0;
    private  remainingInputToCopy:number= 0;
    private  sampleRate:number= 0;
    private  prevPeriod:number= 0;
    private  prevMinDiff:number= 0;
    private  minDiff:number= 0;
    private  maxDiff:number= 0;
    private  useChordPitch:boolean;


    private Int32ToShort(value:number):number{
        return (value<<16)>>16;
    }

    private Int32ToByte(value:number):number{
            return (value<<24)>>24;
    }

    private FloatToInt(value:number):number{
            return Math.floor(value);
    }

    private arraycopy(src, srcPos:number,dest, destPos:number, length:number):void{
        var srcEnd = srcPos + length;
        while (srcPos < srcEnd)
            dest[destPos++] = src[srcPos++];
    }

    // Resize the array.
    private  resize( oldArray:Int16Array,newLength:number) :Int16Array               
    {
        newLength *= this.numChannels;
        let  newArray:Int16Array = new Int16Array(newLength);
        let length:number = oldArray.length <= newLength? oldArray.length : newLength;

        this.arraycopy(oldArray, 0, newArray, 0, length);
        return newArray;
    }

    // Move samples from one array to another.  May move samples down within an array, but not up.
    private  move(  dest:Int16Array, destPos:number, source:Int16Array,sourcePos:number, numSamples:number):void                                   
    {        
        this.arraycopy(source, sourcePos * this.numChannels,dest, destPos * this.numChannels, numSamples * this.numChannels);
    }

    // Scale the samples by the factor.
    private  scaleSamples( samples:Int16Array, position:number, numSamples:number,volume:number):void                             
    {
        let fixedPointVolume:number = this.FloatToInt( (volume*4096.0) );
        let start :number = position*this.numChannels;
        let stop :number = start + numSamples* this.numChannels;

        for(let xSample = start; xSample < stop; xSample++) {
            let value :number = (samples[xSample]*fixedPointVolume) >> 12;
            if(value > Sonic.SHORT_MAX) {
                value = Sonic.SHORT_MAX;
            } else if(value < Sonic.SHORT_MIN) {
                value =  Sonic.SHORT_MIN;
            }
            samples[xSample] = this.Int32ToShort(value);
        }
    }

    // Get the speed of the stream.
    public  getSpeed():number
    {
        return this.speed;
    }

    // Set the speed of the stream.
    public  setSpeed(speed:number):void
    {
        this.speed = speed;
    }

    // Get the pitch of the stream.
    public  getPitch():number
    {
        return this.pitch;
    }

    // Set the pitch of the stream.
    public  setPitch(pitch:number):void
    {
        this.pitch = pitch;
    }

    // Get the rate of the stream.
    public  getRate():number
    {
        return this.rate;
    }

    // Set the playback rate of the stream. This scales pitch and speed at the same time.
    public  setRate(rate:number):void         
    {
        this.rate = rate;
        this.oldRatePosition = 0;
        this.newRatePosition = 0;
    }

    // Get the vocal chord pitch setting.
    public  getChordPitch():boolean
    {
        return this.useChordPitch;
    }

    // Set the vocal chord mode for pitch computation.  Default is off.
    public  setChordPitch( useChordPitch:boolean):void        
    {
        this.useChordPitch = useChordPitch;
    }

    // Get the quality setting.
    public  getQuality():number
    {
        return this.quality;
    }

    // Set the "quality".  Default 0 is virtually as good as 1, but very much faster.
    public  setQuality(quality:number):void
    {
        this.quality = quality;
    }

    // Get the scaling factor of the stream.
    public  getVolume():number
    {
        return this.volume;
    }

    // Set the scaling factor of the stream.
    public  setVolume(volume:number):void        
    {
        this.volume = volume;
    }

    // Allocate stream buffers.
    private  allocateStreamBuffers( sampleRate:number, numChannels:number):void               
    {
        this.minPeriod =  this.FloatToInt(sampleRate / Sonic.SONIC_MAX_PITCH );
        this.maxPeriod =  this.FloatToInt(sampleRate / Sonic.SONIC_MIN_PITCH) ;
        this.maxRequired = 2* this.maxPeriod;
        this.inputBufferSize = this.maxRequired;
        this.inputBuffer = new Int16Array(this.maxRequired*numChannels);
        this.outputBufferSize = this.maxRequired;
        this.outputBuffer =  new Int16Array(this.maxRequired*numChannels);
        this.pitchBufferSize =  this.maxRequired;
        this.pitchBuffer = new Int16Array(this.maxRequired*numChannels);
        this.downSampleBuffer = new Int16Array(this.maxRequired);
        this.sampleRate = sampleRate;
        this.numChannels = numChannels;
        this.oldRatePosition = 0;
        this.newRatePosition = 0;
        this.prevPeriod = 0;
    }

    // Create a sonic stream.
    constructor( sampleRate:number, numChannels:number)
        
        
    {
        this.allocateStreamBuffers(sampleRate, numChannels);
        this.speed = 1.0;
        this.pitch = 1.0;
        this.volume = 1.0;
        this.rate = 1.0;
        this.oldRatePosition = 0;
        this.newRatePosition = 0;
        this.useChordPitch = false;
        this.quality = 0;
    }

    // Get the sample rate of the stream.
    public  getSampleRate():number
    {
        return this.sampleRate;
    }

    // Set the sample rate of the stream.  This will cause samples buffered in the stream to be lost.
    public  setSampleRate(sampleRate:number):void
    {
        this.allocateStreamBuffers(sampleRate, this.numChannels);
    }

    // Get the number of channels.
    public getNumChannels():number
    {
        return this.numChannels;
    }

    // Set the num channels of the stream.  This will cause samples buffered in the stream to be lost.
    public  setNumChannels(numChannels:number):void         
    {
        this.allocateStreamBuffers(this.sampleRate, numChannels);
    }

    // Enlarge the output buffer if needed.
    private  enlargeOutputBufferIfNeeded( numSamples:number):void
        
    {
        if(this.numOutputSamples + numSamples > this.outputBufferSize) {
            this.outputBufferSize += (this.outputBufferSize >> 1) + numSamples;
            this.outputBuffer = this.resize(this.outputBuffer, this.outputBufferSize);
        }
    }

    // Enlarge the input buffer if needed.
    private  enlargeInputBufferIfNeeded( numSamples:number):void
        
    {
        if(this.numInputSamples + numSamples > this.inputBufferSize) {
            this.inputBufferSize += (this.inputBufferSize >> 1) + numSamples;
            this.inputBuffer = this.resize(this.inputBuffer, this.inputBufferSize);
        }
    }

    // Add the input samples to the input buffer.
    private  addFloatSamplesToInputBuffer( samples:Float32Array,numSamples:number):number                 
    {
        if(numSamples == 0) {
            return;
        }
        this.enlargeInputBufferIfNeeded(numSamples);
        let xBuffer:number = this.numInputSamples * this.numChannels;
        for(let xSample = 0; xSample < numSamples*this.numChannels; xSample++) {
            this.inputBuffer[xBuffer++] = this.Int32ToShort((samples[xSample]* Sonic.SHORT_MAX));
        }
        this.numInputSamples += numSamples;
    }

    // Add the input samples to the input buffer.
    private  addShortSamplesToInputBuffer(  samples:Int16Array,numSamples:number):void                
    {
        if(numSamples == 0) {
            return;
        }
        this.enlargeInputBufferIfNeeded(numSamples);
        this.move(this.inputBuffer, this.numInputSamples, samples, 0, numSamples);
        this.numInputSamples += numSamples;
    }

    // Add the input samples to the input buffer.
    private  addUnsignedByteSamplesToInputBuffer(  samples:Int8Array, numSamples:number):void               
    {
        let sample:number;

        this.enlargeInputBufferIfNeeded(numSamples);
        let xBuffer:number = this.numInputSamples*this.numChannels;
        for(let xSample = 0; xSample < numSamples*this.numChannels; xSample++) {
                sample =this.Int32ToShort( ((samples[xSample] & 0xff) - 128)); // Convert from unsigned to signed
            this.inputBuffer[xBuffer++] =this.Int32ToShort( (sample << 8));
        }
        this.numInputSamples += numSamples;
    }

    // Add the input samples to the input buffer.  They must be 16-bit little-endian encoded in a byte array.
    private  addBytesToInputBuffer( inBuffer:Int8Array,  numBytes:number):void               
    {
        let numSamples: number= numBytes/(2*this.numChannels);
        let sample:number;

        this.enlargeInputBufferIfNeeded(numSamples);
        let xBuffer:number = this.numInputSamples*this.numChannels;
        for(let xByte = 0; xByte + 1 < numBytes; xByte += 2) {
                sample = this.Int32ToShort(((inBuffer[xByte] & 0xff) | (inBuffer[xByte + 1] << 8)));
            this.inputBuffer[xBuffer++] = sample;
        }
       this.numInputSamples += numSamples;
    }

    // Remove input samples that we have already processed.
    private  removeInputSamples(position:number):void         
    {
        let remainingSamples:number = this.numInputSamples - position;

        this.move(this.inputBuffer, 0, this.inputBuffer, position, remainingSamples);
        this.numInputSamples = remainingSamples;
    }

    // Just copy from the array to the output buffer
    private  copyToOutput(samples:Int16Array,   position:number,numSamples:number):void                        
    {
        this.enlargeOutputBufferIfNeeded(numSamples);
        this.move(this.outputBuffer, this.numOutputSamples, samples, position, numSamples);
        this.numOutputSamples += numSamples;
    }

    // Just copy from the input buffer to the output buffer.  Return num samples copied.
    private  copyInputToOutput(position:number):number         
    {
        let numSamples:number = this.remainingInputToCopy;

        if(numSamples > this.maxRequired) {
            numSamples = this.maxRequired;
        }
        this.copyToOutput(this.inputBuffer, position, numSamples);
        this.remainingInputToCopy -= numSamples;
        return numSamples;
    }

    // Read data out of the stream.  Sometimes no data will be available, and zero
    // is returned, which is not an error condition.
    public  readFloatFromStream(  samples:Float32Array, maxSamples:number):number               
    {
         let numSamples:number = this.numOutputSamples;
         let remainingSamples:number = 0;

        if(numSamples == 0) {
            return 0;
        }
        if(numSamples > maxSamples) {
            remainingSamples = numSamples - maxSamples;
            numSamples = maxSamples;
        }
        for(let xSample = 0; xSample < numSamples*this.numChannels; xSample++) {
            samples[xSample] = (this.outputBuffer[xSample])/  Sonic.SHORT_MAX;
        }
        this.move(this.outputBuffer, 0, this.outputBuffer, numSamples, remainingSamples);
        this.numOutputSamples = remainingSamples;
        return numSamples;
    }

    // Read short data out of the stream.  Sometimes no data will be available, and zero
    // is returned, which is not an error condition.
    public  readShortFromStream( samples :Int16Array, maxSamples:number):number                
    {
        //  this.printSomeShort("===========readShortFromStream===bengin=======",this.outputBuffer);
        let numSamples: number= this.numOutputSamples;
        let remainingSamples :number = 0;

        if(numSamples == 0) {
            return 0;
        }
        if(numSamples > maxSamples) {
            remainingSamples = numSamples - maxSamples;
            numSamples = maxSamples;
        }
        // this.printSomeShort("===========readShortFromStream====end======",this.outputBuffer);
        this.move(samples, 0,this.outputBuffer, 0, numSamples);
        this.move(this.outputBuffer, 0, this.outputBuffer, numSamples, remainingSamples);
        this.numOutputSamples = remainingSamples;
        return numSamples;
    }

    // Read unsigned byte data out of the stream.  Sometimes no data will be available, and zero
    // is returned, which is not an error condition.
    public  readUnsignedByteFromStream( samples:Int8Array, maxSamples:number):number            
    {
        let numSamples:number = this.numOutputSamples;
        let remainingSamples:number = 0;

        if(numSamples == 0) {
            return 0;
        }
        if(numSamples > maxSamples) {
            remainingSamples = numSamples - maxSamples;
            numSamples = maxSamples;
        }
        for(let xSample = 0; xSample < numSamples*this.numChannels; xSample++) {
                samples[xSample] = this.Int32ToByte( ((this.outputBuffer[xSample] >> 8) + 128) );
        }
        this.move(this.outputBuffer, 0, this.outputBuffer, numSamples, remainingSamples);
        this.numOutputSamples = remainingSamples;
        return numSamples;
    }

    // Read unsigned byte data out of the stream.  Sometimes no data will be available, and zero
    // is returned, which is not an error condition.
    public  readBytesFromStream( outBuffer:Int8Array,maxBytes:number):number                
    {
        let maxSamples:number = maxBytes/(2*this.numChannels);
        let numSamples:number =this.numOutputSamples;
        let remainingSamples:number = 0;

        if(numSamples == 0 || maxSamples == 0) {
            return 0;
        }
        if(numSamples > maxSamples) {
            remainingSamples = numSamples - maxSamples;
            numSamples = maxSamples;
        }
        for(let xSample = 0; xSample < numSamples*this.numChannels; xSample++) {
                let sample:number = this.outputBuffer[xSample];
                outBuffer[xSample << 1] =  this.Int32ToByte(sample & 0xff);
                outBuffer[(xSample << 1) + 1] = this.Int32ToByte(sample >> 8);
        }
        this.move(this.outputBuffer, 0, this.outputBuffer, numSamples, remainingSamples);
        this. numOutputSamples = remainingSamples;
        return 2*numSamples*this.numChannels;
    }

    // Force the sonic stream to generate output using whatever data it currently
    // has.  No extra delay will be added to the output, but flushing in the middle of
    // words could introduce distortion.
    public  flushStream():void
    {
        let remainingSamples:number = this.numInputSamples;
        let s:number = this.speed/this.pitch;
        let r:number = this.rate*this.pitch;
        let expectedOutputSamples:number = this.numOutputSamples +this.FloatToInt( ((remainingSamples/s + this.numPitchSamples)/r + 0.5 ));

        // Add enough silence to flush both input and pitch buffers.
        this.enlargeInputBufferIfNeeded(remainingSamples + 2*this.maxRequired);
        for(let xSample = 0; xSample < 2*this.maxRequired*this.numChannels; xSample++) {
            this.inputBuffer[remainingSamples*this.numChannels + xSample] = 0;
        }
        this.numInputSamples += 2*this.maxRequired;
        this.writeShortToStream(null, 0);
        // Throw away any extra samples we generated due to the silence we added.
        if(this.numOutputSamples > expectedOutputSamples) {
            this.numOutputSamples = expectedOutputSamples;
        }
        // Empty input and pitch buffers.
        this.numInputSamples = 0;
        this.remainingInputToCopy = 0;
        this.numPitchSamples = 0;
    }

    // Return the number of samples in the output buffer
    public  samplesAvailable():number
    {
        return this.numOutputSamples;
    }

    // If skip is greater than one, average skip samples together and write them to
    // the down-sample buffer.  If numChannels is greater than one, mix the channels
    // together as we down sample.
    private  downSampleInput( samples:Int16Array,position:number,skip:number):void                         
    {
        let numSamples:number = this.maxRequired/skip;
        let samplesPerValue:number = this.numChannels*skip;
        let value:number;

        position *= this.numChannels;
        for(let i = 0; i < numSamples; i++) {
            value = 0;
            for(let j = 0; j < samplesPerValue; j++) {
                value += samples[position + i*samplesPerValue + j];
            }
            value /= samplesPerValue;
            this.downSampleBuffer[i] = this.Int32ToShort (value);
        }
    }

    // Find the best frequency match in the range, and given a sample skip multiple.
    // For now, just find the pitch of the first channel.
    private  findPitchPeriodInRange( samples:Int16Array,position:number,minPeriod:number, maxPeriod:number):number                           
    {
        let bestPeriod:number = 0, worstPeriod = 255;
        let minDiff:number = 1, maxDiff = 0;

        position *= this.numChannels;
        for(let period = minPeriod; period <= maxPeriod; period++) {
            let diff:number = 0;
            for(let i = 0; i < period; i++) {
                let sVal:number = samples[position + i];
                 let pVal:number = samples[position + period + i];
                diff += sVal >= pVal? sVal - pVal : pVal - sVal;
            }
            /* Note that the highest number of samples we add into diff will be less
               than 256, since we skip samples.  Thus, diff is a 24 bit number, and
               we can safely multiply by numSamples without overflow */
            if(diff*bestPeriod < minDiff*period) {
                minDiff = diff;
                bestPeriod = period;
            }
            if(diff*worstPeriod > maxDiff*period) {
                maxDiff = diff;
                worstPeriod = period;
            }
        }
        this.minDiff = minDiff/bestPeriod;
        this.maxDiff = maxDiff/worstPeriod;

        return bestPeriod;
    }

    // At abrupt ends of voiced words, we can have pitch periods that are better
    // approximated by the previous pitch period estimate.  Try to detect this case.
    private  prevPeriodBetter(minDiff:number, maxDiff:number, preferNewPeriod:boolean):boolean                     
    {
        if(minDiff == 0 || this.prevPeriod == 0) {
            return false;
        }
        if(preferNewPeriod) {
            if(maxDiff > minDiff*3) {
                // Got a reasonable match this period
                return false;
            }
            if(minDiff*2 <= this.prevMinDiff*3) {
                // Mismatch is not that much greater this period
                return false;
            }
        } else {
            if(minDiff <= this.prevMinDiff) {
                return false;
            }
        }
        return true;
    }

    // Find the pitch period.  This is a critical step, and we may have to try
    // multiple ways to get a good answer.  This version uses AMDF.  To improve
    // speed, we down sample by an integer factor get in the 11KHz range, and then
    // do it again with a narrower frequency range without down sampling
    private  findPitchPeriod( samples:Int16Array,   position:number, preferNewPeriod:boolean):number                  
    {
        let period:number, retPeriod:number;
        let skip : number= 1;

        if(this.sampleRate > Sonic.SONIC_AMDF_FREQ && this.quality == 0) {
            skip =this.sampleRate/Sonic.SONIC_AMDF_FREQ;
        }
        if(this.numChannels == 1 && skip == 1) {
            period = this.findPitchPeriodInRange(samples, position, this.minPeriod, this.maxPeriod);
        } else {
            this.downSampleInput(samples, position, skip);
            period = this.findPitchPeriodInRange(this.downSampleBuffer, 0, this.minPeriod/skip,
               this.maxPeriod/skip);
            if(skip != 1) {
                period *= skip;
                let minP: number = period - (skip << 2);
                let maxP: number = period + (skip << 2);
                if(minP < this.minPeriod) {
                    minP = this.minPeriod;
                }
                if(maxP > this.maxPeriod) {
                    maxP = this.maxPeriod;
                }
                if(this.numChannels == 1) {
                    period = this.findPitchPeriodInRange(samples, position, minP, maxP);
                } else {
                    this.downSampleInput(samples, position, 1);
                    period = this.findPitchPeriodInRange(this.downSampleBuffer, 0, minP, maxP);
                }
            }
        }
        if(this.prevPeriodBetter(this.minDiff, this.maxDiff, preferNewPeriod)) {
            retPeriod = this.prevPeriod;
        } else {
            retPeriod = period;
        }
       this. prevMinDiff = this.minDiff;
       this. prevPeriod = period;
        return retPeriod;
    }

    // Overlap two sound segments, ramp the volume of one down, while ramping the
    // other one from zero up, and add them, storing the result at the output.
    private  overlapAdd(numSamples: number,numChannels: number,out:Int16Array,outPos: number,rampDown:Int16Array,rampDownPos: number,rampUp:Int16Array,rampUpPos: number):void
    {
         for(let i = 0; i < numChannels; i++) {
            let o:number = outPos*numChannels + i;
            let u:number = rampUpPos*numChannels + i;
            let d:number = rampDownPos*numChannels + i;
            for(let t = 0; t < numSamples; t++) {
                out[o] = this.Int32ToShort(((rampDown[d]*(numSamples - t) + rampUp[u]*t)/numSamples));
                o += numChannels;
                d += numChannels;
                u += numChannels;
            }
        }
    }

    // Overlap two sound segments, ramp the volume of one down, while ramping the
    // other one from zero up, and add them, storing the result at the output.
    private  overlapAddWithSeparation(numSamples:number,numChannels:number,separation:number,out:Int16Array,outPos:number,rampDown:Int16Array,rampDownPos:number,rampUp:Int16Array,rampUpPos:number):void
    {
        for(let i = 0; i < numChannels; i++) {
             let o:number = outPos*numChannels + i;
             let u:number = rampUpPos*numChannels + i;
             let d:number = rampDownPos*numChannels + i;
            for(let t = 0; t < numSamples + separation; t++) {
                if(t < separation) {
                    out[o] =this.Int32ToShort( (rampDown[d]*(numSamples - t)/numSamples) );
                    d += numChannels;
                } else if(t < numSamples) {
                    out[o] =this.Int32ToShort( ((rampDown[d]*(numSamples - t) + rampUp[u]*(t - separation))/numSamples));
                    d += numChannels;
                    u += numChannels;
                } else {
                    out[o] =this.Int32ToShort( (rampUp[u]*(t - separation)/numSamples));
                    u += numChannels;
                }
                o += numChannels;
            }
        }
    }

    // Just move the new samples in the output buffer to the pitch buffer
    private  moveNewSamplesToPitchBuffer( originalNumOutputSamples:number):void        
    {   
        //numOutputSamples
         let numSamples:number = this.numOutputSamples - originalNumOutputSamples;

        if(this.numPitchSamples + numSamples > this.pitchBufferSize) {
            this.pitchBufferSize += (this.pitchBufferSize >> 1) + numSamples;
            this.pitchBuffer = this.resize(this.pitchBuffer, this.pitchBufferSize);
        }
        this.move(this.pitchBuffer, this.numPitchSamples, this.outputBuffer, originalNumOutputSamples, numSamples);
        this.numOutputSamples = originalNumOutputSamples;
        this.numPitchSamples += numSamples;
    }

    // Remove processed samples from the pitch buffer.
    private  removePitchSamples(numSamples:number):void         
    {
        if(numSamples == 0) {
            return;
        }
        this.move(this.pitchBuffer, 0, this.pitchBuffer, numSamples, this.numPitchSamples - numSamples);
        this.numPitchSamples -= numSamples;
    }

    // Change the pitch.  The latency this introduces could be reduced by looking at
    // past samples to determine pitch, rather than future.
    private  adjustPitch( originalNumOutputSamples:number):void        
    {
        // numOutputSamples
         let period:number, newPeriod:number, separation:number ;
         let position :number= 0;

        if(this.numOutputSamples == originalNumOutputSamples) {
            return;
        }
        this.moveNewSamplesToPitchBuffer(originalNumOutputSamples);
        while(this.numPitchSamples - position >= this.maxRequired) {
            period = this.findPitchPeriod(this.pitchBuffer, position, false);
            newPeriod = this.FloatToInt( (period/this.pitch));
            this.enlargeOutputBufferIfNeeded(newPeriod);
            if(this.pitch >= 1.0) {
                this.overlapAdd(newPeriod, this.numChannels, this.outputBuffer, this.numOutputSamples, this.pitchBuffer,
                        position, this.pitchBuffer, position + period - newPeriod);
            } else {
                separation = newPeriod - period;
                this.overlapAddWithSeparation(period, this.numChannels, separation, this.outputBuffer, this.numOutputSamples,
                        this.pitchBuffer, position, this.pitchBuffer, position);
            }
            this.numOutputSamples += newPeriod;
            position += period;
        }
        this.removePitchSamples(position);
    }

    // Aproximate the sinc function times a Hann window from the sinc table.
    private  findSincCoefficient( i:number,  ratio:number,  width:number):number {
         let lobePoints:number =   this.FloatToInt( (Sonic.SINC_TABLE_SIZE-1)/Sonic.SINC_FILTER_POINTS );
         let left:number = i*lobePoints +this.FloatToInt( (ratio*lobePoints)/width);
         let right:number = left + 1;
         let position:number = i*lobePoints*width + ratio*lobePoints - left*width;
         let leftVal:number = Sonic.sincTable[left];
         let rightVal:number =Sonic.sincTable[right];

        return this.FloatToInt( ((leftVal*(width - position) + rightVal*position) << 1)/width  );
    }

    // Return 1 if value >= 0, else -1.  This represents the sign of value.
    private  getSign( value) {
        return value >= 0? 1 : -1;
    }


    // Interpolate the new output sample.
     // Index to first sample which already includes channel offset.
    private  interpolate( inarr:Int16Array, inPos:number,oldSampleRate:number, newSampleRate:number):number                                  
    {
        // Compute N-point sinc FIR-filter here.  Clip rather than overflow.      
         let i:number;
         let total:number = 0;
         let position:number = this.newRatePosition*oldSampleRate;
         let leftPosition:number = this.oldRatePosition*newSampleRate;
         let rightPosition:number = (this.oldRatePosition + 1)*newSampleRate;
         let ratio:number = rightPosition - position - 1;
         let width:number = rightPosition - leftPosition;
         let weight:number, value:number;
         let oldSign:number;
         let overflowCount:number = 0;

        for (i = 0; i < Sonic.SINC_FILTER_POINTS; i++) {
            weight = this.findSincCoefficient(i, ratio, width);
            /* printf("%u %f\n", i, weight); */
            value = inarr[inPos + i*this.numChannels]*weight;
            oldSign = this.getSign(total);
            total += value;
            if (oldSign != this.getSign(total) && this.getSign(value) == oldSign) {
                /* We must have overflowed.  This can happen with a sinc filter. */
                overflowCount += oldSign;
            }
        }
        /* It is better to clip than to wrap if there was a overflow. */
        if (overflowCount > 0) {
            return  Sonic.SHORT_MAX;
        } else if (overflowCount < 0) {
            return Sonic.SHORT_MIN;
        }
       
        // let res = this.Int32ToShort(total >> 16);
        // return res;
        return this.Int32ToShort(total >> 16);
    }

    // Change the rate.
    private  adjustRate( rate:number, originalNumOutputSamples:number):void            
    {
        // numOutputSamples
         let newSampleRate:number = this.FloatToInt( (this.sampleRate/rate) );
         let oldSampleRate:number = this.sampleRate;
         let position:number;

        // Set these values to help with the integer math
        // 设置这些值以帮助进行整数计算
        while(newSampleRate > (1 << 14) || oldSampleRate > (1 << 14)) {
            newSampleRate >>= 1;
            oldSampleRate >>= 1;
        }
        if(this.numOutputSamples == originalNumOutputSamples) {
            return;
        }
        this.moveNewSamplesToPitchBuffer(originalNumOutputSamples);
        // Leave at least one pitch sample in the buffer
    

        for(position = 0; position < this.numPitchSamples - 1; position++) {
            while((this.oldRatePosition + 1)*newSampleRate > this.newRatePosition*oldSampleRate) {
                this.enlargeOutputBufferIfNeeded(1);
                for(let i = 0; i < this.numChannels; i++) {
                    this.outputBuffer[this.numOutputSamples*this.numChannels + i] = this.interpolate(this.pitchBuffer,  position*this.numChannels + i, oldSampleRate, newSampleRate);                          
                }
                this.newRatePosition++;
                this.numOutputSamples++;
            }
            this.oldRatePosition++;
            if(this.oldRatePosition == oldSampleRate) {
                this.oldRatePosition = 0;
                if(this.newRatePosition != newSampleRate) {
                    // System.out.printf("Assertion failed: newRatePosition != newSampleRate\n");
                    // assert false;
                }
                this.newRatePosition = 0;
            }
        }

        // this.printSomeShort("************adjustRateend begin**************",this.outputBuffer);
        this.removePitchSamples(position);
    }


    // Skip over a pitch period, and copy period/speed samples to the output
    private  skipPitchPeriod(samples:Int16Array, position:number, speed:number, period):number                             
    {
         let newSamples:number;

        if(speed >= 2.0) {
            newSamples = this.FloatToInt( period/(speed - 1.0) );
        } else {
            newSamples = period;
            let remainingInputToCopy:number =this.FloatToInt( period*(2.0 - speed)/(speed - 1.0) );
        }
        this.enlargeOutputBufferIfNeeded(newSamples);
        this.overlapAdd(newSamples, this.numChannels, this.outputBuffer, this.numOutputSamples, samples, position,
                samples, position + period);
        this.numOutputSamples += newSamples;
        return newSamples;
    }

    // Insert a pitch period, and determine how much input to copy directly.
    private  insertPitchPeriod(samples:Int16Array,position:number,speed:number, period):number                               
    {
         let newSamples:number;

        if(speed < 0.5) {
            newSamples = this.FloatToInt( (period*speed/(1.0 - speed)));
        } else {
            newSamples = period;
            this.remainingInputToCopy = this.FloatToInt(period*(2.0*speed - 1.0)/(1.0 - speed)) ;
        }
        this.enlargeOutputBufferIfNeeded(period + newSamples);
        this.move(this.outputBuffer, this.numOutputSamples, samples, position, period);
        this.overlapAdd(newSamples, this.numChannels, this.outputBuffer, this.numOutputSamples + period, samples,
                position + period, samples, position);
        this.numOutputSamples += period + newSamples;
        return newSamples;
    }

    // Resample as many pitch periods as we have buffered on the input.  Return 0 if
    // we fail to resize an input or output buffer.  Also scale the output by the volume.
    private  changeSpeed(speed:number):void         
    {
         let numSamples:number = this.numInputSamples;
         let  position :number= 0, period:number, newSamples:number;

        if(this.numInputSamples < this.maxRequired) {
            return;
        }
        do {
            if(this.remainingInputToCopy > 0) {
                newSamples = this.copyInputToOutput(position);
                position += newSamples;
            } else {
                // this.printSomeShort("changeSpeed->findPitchPeriod (inputBuffer)",this.inputBuffer);
                period = this.findPitchPeriod(this.inputBuffer, position, true);
                if(speed > 1.0) {
                    newSamples = this.skipPitchPeriod(this.inputBuffer, position, speed, period);
                    //  this.printSomeShort("changeSpeed->skipPitchPeriod (outputBuffer)",this.outputBuffer);
                    position += period + newSamples;
                } else {
                    newSamples = this.insertPitchPeriod(this.inputBuffer, position, speed, period);
                    //  this.printSomeShort("changeSpeed->insertPitchPeriod (outputBuffer)",this.outputBuffer);
                    position += newSamples;
                }
            }
        } while(position + this.maxRequired <= numSamples);
        this.removeInputSamples(position);
        // JK.console.log("changeSpeed end  "+this.numOutputSamples);
        //   this.printSomeShort("changeSpeed->endend (outputBuffer)",this.outputBuffer);
    }

    // Resample as many pitch periods as we have buffered on the input.  Scale the output by the volume.
    private  processStreamInput():void
    {
        let originalNumOutputSamples:number = this.numOutputSamples;
        let s:number = this.speed/this.pitch;
        let r:number = this.rate;

        if(!this.useChordPitch) {
            r *= this.pitch;
        }
        if(s > 1.00001 || s < 0.99999) {
            this.changeSpeed(s);
            
        } else {
            this.copyToOutput(this.inputBuffer, 0, this.numInputSamples);
            this.numInputSamples = 0;
              
        }
        //   JK.console.log("processStreamInput useChordPitch before  "+this.numOutputSamples);

        // this.printSomeShort("************adjustRateend begin**************",this.outputBuffer);
        if(this.useChordPitch) {
            if(this.pitch != 1.0) {
                this.adjustPitch(originalNumOutputSamples);
            }
        } else if(r != 1.0) {
            
            this.adjustRate(r, originalNumOutputSamples);
          
        }
        // JK.console.log("processStreamInput useChordPitch after  "+this.numOutputSamples);
        if(this.volume != 1.0) {
            // Adjust output volume.
            // this.scaleSamples(this.outputBuffer, originalNumOutputSamples, this.numOutputSamples - originalNumOutputSamples, this.volume);              
        }

        //  this.printSomeShort("************adjustRateendend**************",this.outputBuffer);
    }

    // Write floating point data to the input buffer and process it.
    public  writeFloatToStream( samples:Float32Array,numSamples:number):void                
    {
        this.addFloatSamplesToInputBuffer(samples, numSamples);
        this.processStreamInput();
    }

    // Write the data to the input stream, and process it.
    public  writeShortToStream(  samples:Int16Array, numSamples):void           
    {
        this.addShortSamplesToInputBuffer(samples, numSamples);
        this.processStreamInput();
    }

    // Simple wrapper around sonicWriteFloatToStream that does the unsigned byte to short
    // conversion for you.
    public  writeUnsignedByteToStream(samples:Int8Array,numSamples:number):void                 
    {
        this.addUnsignedByteSamplesToInputBuffer(samples, numSamples);
        this.processStreamInput();
    }

    // Simple wrapper around sonicWriteBytesToStream that does the byte to 16-bit LE conversion.
    public  writeBytesToStream(  inBuffer:Int8Array, numBytes):void           
    {
        this.addBytesToInputBuffer(inBuffer, numBytes);
        this.processStreamInput();
    }

    // This is a non-stream oriented interface to just change the speed of a sound sample
    public static  changeFloatSpeed(samples:Float32Array, numSamples:number,speed:number, pitch:number,  rate:number,  volume:number, useChordPitch:boolean, sampleRate:number,   numChannels:number) :number                                                                  
    {
        let stream:Sonic = new Sonic(sampleRate, numChannels);

        stream.setSpeed(speed);
        stream.setPitch(pitch);
        stream.setRate(rate);
        stream.setVolume(volume);
        stream.setChordPitch(useChordPitch);
        stream.writeFloatToStream(samples, numSamples);
        stream.flushStream();
        numSamples = stream.samplesAvailable();
        stream.readFloatFromStream(samples, numSamples);
        return numSamples;
    }

    /* This is a non-stream oriented interface to just change the speed of a sound sample */
    public  sonicChangeShortSpeed( samples:Int16Array,numSamples:number, speed:number,  pitch:number,   rate:number,  volume:number, useChordPitch:boolean, sampleRate:number, numChannels:number):number                                                                     
    {
        let stream:Sonic= new Sonic(sampleRate, numChannels);
        stream.setSpeed(speed);
        stream.setPitch(pitch);
        stream.setRate(rate);
        stream.setVolume(volume);
        stream.setChordPitch(useChordPitch);
        stream.writeShortToStream(samples, numSamples);
        stream.flushStream();
        numSamples = stream.samplesAvailable();
        stream.readShortFromStream(samples, numSamples);
        return numSamples;
    }

    public  InitSonic(pitch:number,speed:number,rate:number,volume:number,quality:number,emulateChordPitch:boolean):void{
            let _pitch:number = Math.exp((pitch / 12.0));
            let _rate:number =  1.0 + 0.01 * rate;
            let _speed:number =  1.0 + 0.01 * speed;
            

            this.setSpeed(_speed);
            this.setPitch(_pitch);
            this.setRate(_rate);
            this.setVolume(volume);
            this.setChordPitch(emulateChordPitch);  //和旋
            this.setQuality(quality);
    }

    //=========================测试取样打印===================================
     public printSomeShort(info:string, samples:Int16Array):void{
        console.log("-->"+info +"=="+ samples.slice(0,100));
     }

    public printSomeByte(info:string, samples:Int8Array):void{
        console.log("-->"+info +"=="+ samples.slice(0,100));
     }

    public  printSomeFloat(info:string, samples:Float32Array):void{
        console.log("-->"+info +"=="+ samples.slice(0,100));
     }
}
