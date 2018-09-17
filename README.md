# Welcome to PFCompute
A project aiming at explore the mechanism of how pianist decide which fingers should be used while playing a specific piece. 

## Structure
The project so far has gone through 3 stages. In the first stage, core algorithm for computing piano fingering is designed and implemented. Next, with the help of XML parser, it became possible to read Music Scores marked in MusicXML. Then, a web app is created to provide a more friendly user-interface.

### Core Algorithm
The core algorithm is designed and implemented in C. In general, it tries to map different playing strategies, including sequential fingering, rotating fingering and extending fingering, into models which estimate the difficulty of playing a certain piece. The algorithm then takes a combined approach of back-trace and greedy strategy to search for the optimized fingering for a certain piece. Detailed mechanism is further explained in the essay.

### Music Score Parser
As the first part only takes in numeric input, a parser that reads in music score in MusicXML format is developed. The whole algorithm is then rewritten in Matlab for further tuning.

### Web App PFCompute 
The project is further rewritten in Node.js. This is then served as a web app with the help of the Express.js framework. 


