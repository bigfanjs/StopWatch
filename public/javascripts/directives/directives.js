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
          rege = /([A-Z]+)([.:\-_\s])([A-Z]+)\2([A-Z]+)(\2([A-Z]+))?/i,
          components = format.match( rege ),
          units = format.split( /:|-|_|\./ );

        if ( components === null ) {
          throw TypeError('Invalid stop watch format!');
        }

        const
          separator = components[ 2 ],
          length = units.length,
          elapsedTime = input.getTime(),
          time = units.map(item => {
            let result;

            const floor = Math.floor;

            switch ( item ) {
              case 'h':
                const houre = floor(( elapsedTime / 36e+5 ) % 12);
                result = (houre < 10 ? '0' : '') + houre;
                break;
              case 'min':
                const minute = floor(( elapsedTime / 6e+4 ) % 60);
                result = (minute < 10 ? '0' : '') + minute;
                break;
              case 's':
                const second = floor(( elapsedTime / 1000 ) % 60);
                result = (second < 10 ? '0' : '') + second;
                break;
              case 'ms':
                const milisecond = floor(elapsedTime % 100);
                result = (milisecond < 10 ? '0' : '') + milisecond;
                break;
            }

            return result;
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