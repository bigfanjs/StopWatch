angular.module('appExp', [])
  .controller('defaultCtrl', function ( $scope ) {})
  .directive('stopWatch', function ( StopWatchFactory ) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'templates/template1.html',
      link: function ( scope, elem, attrs ) {
        const stopWatchFactory = StopWatchFactory();

        scope.format = attrs.format;
        Object.assign( scope, stopWatchFactory );
      }
    };
  })
  .filter('stopWatchFormat', function () {
    return ( input, format = 'min:s:ms' ) => {
      if ( angular.isDefined( input ) ) {
        const
          rege = /(h|min|s|ms)([.:\-_\s])(h|min|s|ms)\2(h|min|s|ms)(\2(h|min|s|ms))?/i,
          components = format.match( rege );

        if ( components === null ) {
          throw TypeError('Invalid stop watch format!');
        }

        components.shift();

        const separator = components[ 1 ];

        // get red of the separator.
        components.splice( 1, 1 );

        const
          length = components.length,
          elapsedTime = input.getTime(),
          time = components.map(item => {
            const floor = Math.floor;

            switch ( item ) {
              case 'h':
                const houre = floor(( elapsedTime / 1000 / 60/ 60 ) % 12);
                return (houre < 10 ? '0' : '') + houre;
              case 'min':
                const minute = floor(( elapsedTime / 1000 / 60 ) % 60);
                return (minute < 10 ? '0' : '') + minute;
              case 's':
                const second = floor(( elapsedTime / 1000 ) % 60);
                return (second < 10 ? '0' : '') + second;
              case 'ms':
                const milisecond = floor(elapsedTime % 100);
                return (milisecond < 10 ? '0' : '') + milisecond;
            }
          }),
          result = time.join( separator );

        return result;
      }
    };
  })
  .factory('StopWatchFactory', ['$interval', function ( $interval ) {
    return options => {
      var
        interval = null,
        startTime = 0,
        offset = 0;

      const obj = {
        startStop: 'Start',
        elapsedTime: new Date( 0 ),
        start() {
          startTime = new Date().getTime();

          interval = $interval(() => {
            const time = offset + new Date().getTime() - startTime;

            this.elapsedTime.setTime( time );
          }, 1000/60);
        },
        stop() {
          offset = this.elapsedTime.getTime();
          $interval.cancel( interval );
        },
        toggle() {
          if ( this.startStop.match( /^start/i ) ) {
            this.startStop = 'Stop';
            this.start();
          } else {
            this.startStop = 'Start';
            this.stop();
          }
        },
        reset() {
          startTime = new Date().getTime();
          this.elapsedTime.setTime( 0 );
          offset = 0;
        }
      };

      return obj;
    };
  }]);

  /*
        var
          elapesTime = input.getTime(),
          milliseconds = elapesTime % 100,
          seconds = Math.floor( elapesTime / 1000 ) % 60,
          minutes = Math.floor( elapesTime / 1000 / 60 ) % 60;

        milliseconds = (milliseconds < 10 ? '0' : '') + milliseconds;
        seconds = (seconds < 10 ? '0' : '') + seconds;
        minutes = (minutes < 10 ? '0' : '') + minutes;

        return `${ minutes }:${ seconds }:${ milliseconds }`;
  */