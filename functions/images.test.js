const fs = require('fs')
const setUp = require('./test-helpers/setUp')
setUp.setDefaults('test-images')
const gulpConfig = setUp.gulpConfig
const images = require('./images')

const imageContents = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
  '<!-- Created with Inkscape (http://www.inkscape.org/) -->\n' +
  '\n' +
  '<svg\n' +
  '   xmlns:dc="http://purl.org/dc/elements/1.1/"\n' +
  '   xmlns:cc="http://creativecommons.org/ns#"\n' +
  '   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\n' +
  '   xmlns:svg="http://www.w3.org/2000/svg"\n' +
  '   xmlns="http://www.w3.org/2000/svg"\n' +
  '   xmlns:xlink="http://www.w3.org/1999/xlink"\n' +
  '   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"\n' +
  '   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"\n' +
  '   id="svg2"\n' +
  '   version="1.1"\n' +
  '   inkscape:version="0.91 r13725"\n' +
  '   width="600"\n' +
  '   height="600"\n' +
  '   viewBox="0 0 600 600"\n' +
  '   sodipodi:docname="logo.svg">\n' +
  '  <metadata\n' +
  '     id="metadata8">\n' +
  '    <rdf:RDF>\n' +
  '      <cc:Work\n' +
  '         rdf:about="">\n' +
  '        <dc:format>image/svg+xml</dc:format>\n' +
  '        <dc:type\n' +
  '           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />\n' +
  '        <dc:title></dc:title>\n' +
  '      </cc:Work>\n' +
  '    </rdf:RDF>\n' +
  '  </metadata>\n' +
  '  <defs\n' +
  '     id="defs6" />\n' +
  '  <sodipodi:namedview\n' +
  '     pagecolor="#ffffff"\n' +
  '     bordercolor="#666666"\n' +
  '     borderopacity="1"\n' +
  '     objecttolerance="10"\n' +
  '     gridtolerance="10"\n' +
  '     guidetolerance="10"\n' +
  '     inkscape:pageopacity="0"\n' +
  '     inkscape:pageshadow="2"\n' +
  '     inkscape:window-width="1280"\n' +
  '     inkscape:window-height="737"\n' +
  '     id="namedview4"\n' +
  '     showgrid="false"\n' +
  '     inkscape:zoom="0.39333333"\n' +
  '     inkscape:cx="300"\n' +
  '     inkscape:cy="300"\n' +
  '     inkscape:window-x="-8"\n' +
  '     inkscape:window-y="-8"\n' +
  '     inkscape:window-maximized="1"\n' +
  '     inkscape:current-layer="svg2" />\n' +
  '  <image\n' +
  '     width="600"\n' +
  '     height="600"\n' +
  '     preserveAspectRatio="none"\n' +
  '     xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAYAAACLz2ctAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz\n' +
  'AAADsQAAA7EB9YPtSQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAhrSURB\n' +
  'VHic7d3fi1x3Gcfx97M7TdKYYNPYbLaxlVZrUaK1iviToiIpeNFIwQuLBW8UEQTv9C/wSvDS+yKo\n' +
  'CFopiFe2QVpqMKVYf0DaRmibZnfTRpNs9lez+3hxzq7T3ZnZmXO+3/PMmf284DDJzJznPGfOZ79n\n' +
  'zpmzs+buiESZim5A9jYFUEIpgBJKAZRQCqCEUgAllAIooRRACaUASigFUEIpgBJKAZRQCqCEUgAl\n' +
  'lAIooRRACaUASigFUEIpgBKqU2dmM5spa2wAXk4bXf/vd7/3eQ6AbZumdvl/931T2+6b6rOODtzs\n' +
  '00Ov3gY+7u5uZr2W36+33R6fBt509/XBW6A3M9sPHAPWh1ynXe/bZR0HbYN+6zwF3KgVQOBbwGzN\n' +
  'Gq1XbJfkfgJcqTjvXcD3EvaSax2fr7sL3p+kDemlzmvblu2yXwEcX3Ve233JushLARxjB2rMO/kB\n' +
  'NLNpah7EyEB7YQQ8UGcE1OiXV50QtSWA+xTA8VUnRHV23026xap+N0y5Cz4GHAIO97i9GziYps+R\n' +
  'rAGXgXlgobx9G1gtp0M9ej0M3EbRc9M/WOtd/W5Oc8Bld9+oUrBr2xwHZrpuj9L8hw9LwGvANeB6\n' +
  '17QIXKscwN2UJy1ngVPAySwL+b8V4AzwV+C/XnGlyg13D/AIcGe69nZw4AXgGWC+atBGZWYd4ATw\n' +
  'VeAjmRf3KvAUcHHQ9sgWwK0FFEH8LnBfpkW8APzO3ZdTFTSzw8CPyLMrWwJ+7u6XMtQempl9CPgO\n' +
  'xacuqV0Bfurua7s9MftwXKb/bKbyK8CTKcMH4O7XKX6Cc3guOnwA7v4KcC5T+X8OEz5o7v1Arhf8\n' +
  'jLsvZar9Zoaa68CzGepW9UymukO/dk0FcIHiw//UzmeouSnHD82VcnQdC+6+ALyTofTQr10jASzf\n' +
  'ZC9kKJ1zY85nqDk24euSo6e5YZ/Y5CF5jhHwWoaam3KMDOMYwMXUBd196NeuzRekLrt7jlDnNI4B\n' +
  'DO2pzQHMOfrlMo4BTD4CjqLNAVyNbqCCoU5NNCy0pzYHUCaAAiihFEAJpQBKKAVQQimAEkoBlFAK\n' +
  'oIRSACWUAiihFEAJpQBKKAVQQimAEkoBlFAKoIRSACWUAiihFEAJpS+YbNZDZvZgdBPbHIlcuALY\n' +
  'rCMEb/Bxo12whFIAJZQCKKEUQAmlAEooBVBCKYASSgGUUDoR3awLwMXoJrb5IHn/JMVACmCzXnL3\n' +
  'P0c30c3MThMYQO2CJVSbA5jlT3hLs9ocwDb3LqU2b0SNgBOgzQFsc+9SavNG1Ag4AdocwDb3LqU2\n' +
  'b8Q29y6lNm9E7YIngAIoodocQJkACqCEUgAllAIooRRACaUASigFUEIpgBJKAZRQCqCEUgAllAIo\n' +
  'oRRACdXmAN7MXF9X21RkZkPnqs0BXM1c/z2Z60+yoV87BbC/Q5nrT7KhXzsFsL/DGWqO4249R08K\n' +
  'YAI5RsCjGWrWlaOnPRHAlcz135ehZtiXAA0wm6HmHcM+sc0BzDYCmtlB4BMZSufY2JWZ2a3AbRlK\n' +
  'f8bMpod5ogLY2xeAWzLUPWBm4zQK3pOp7nuBTw3zxDYHMPku2MyOmdm3gYdT1+7yTTO7PWP9oZjZ\n' +
  'CeDRjIv4hpk9ZmYD/zJUm7+gsvIIWJ4ovR2YAY6X0+a/c/9QzgI/NrPXgZeBt4BF4Ho5Lbr7RooF\n' +
  'mVmH4oDgcNftDHBf2UfOo3IDPgk8YGaXgDlgvpzmgP+4u++pAJqZAT+k2AiR6z4FfKCctnMzWwZ+\n' +
  '7+7nqhQ3s68AXwZurd5iMtPA+8up25qZXWjzLnjkALq7A8cY75HfgIMUG66qacYjfIPsA+5ocwCr\n' +
  'vgfMff4wlbWgeZu02uYAXqk4X2s2To1527KOa00GMOUuYdndr1WctzUbJ2jeJq00GcCUV5fM1Zi3\n' +
  'NRunxrxteZvRzC64PO2RcgS8VGPetgRwL+yCV5s6GjxI2nNOdUbA54DzgHdNG31uh33cKdZvc5rq\n' +
  'c9vvvl7/v15jHeeBP/RZhzrraQy/nsM8/npTAUx9cecrVWd097+lbGQcuftV4E/RfQyjqfeAKQP4\n' +
  'lrsvJKwngZoKYMprzv6RsJYEGxhAM7vXzD6dYDkfT1Bj098T1pJgO94DlkesJ4EvAXeX930U+LW7\n' +
  'j3xqoLzm7MP12txy0d3/naiWjIF3BbAM32PsvBjzY8CdZvaEu4/6925PUu9zzW5/TFRHxsTWLri8\n' +
  'gvVx+l8JfBT4gZl9fsRlpLqy+DV3/1eiWjImut8DnqYY6QbpAI+a2eNmtn+34uWu+/4a/XXT6DeB\n' +
  'OgDlZeKfG2G+B4ATZvZbdz/f6wlmdj/F7jyFl/otR9rN3B0z+z5wb8Ual4CzwBvAMsWVxg9S7HpT\n' +
  'fPrxNvCzKgdAMv46Znac6uGD4tLu04n62e4m8ITCN7mmgLuimxjgyQpH3dIiHXZeqz8OHHjK3Z+P\n' +
  'bkTy6pDuHF0qDvzG3c9GNyL5TQEXopvosg78QuHbOzrAq9FNlK4Cv3L3l6MbkeZ03P2qmV1mhC+U\n' +
  'yeAcxQHHcmAPEmDzk5AzQcu/QXGa5ZcK395kxe9qg5mdAk41tNw14FngaXdfamiZMoa2AghgZl8H\n' +
  'vphxee9Q/E7G0+6+mHE50hLbA2jA14CHSHt6Zg54EfiLu9f5ZRuZMO8K4NadxdeHPUzx7UZVP8+9\n' +
  'TBG6F919vnKHMtF6BnDrQbNZ4LMU3yY1w84v7naKX6C+QXFRwhubk7vfyNGwTJaBAdzxZLMDwBGK\n' +
  'g4glYMVHKSCyzUgBFEmtzd+OJRNAAZRQCqCEUgAllAIooRRACaUASigFUEIpgBJKAZRQCqCEUgAl\n' +
  'lAIooRRACaUASigFUEIpgBJKAZRQCqCEUgAllAIooRRACaUASigFUEL9D1MqMi7YkUEVAAAAAElF\n' +
  'TkSuQmCC\n' +
  '"\n' +
  '     id="image10"\n' +
  '     x="0"\n' +
  '     y="0" />\n' +
  '  <path\n' +
  '     style="fill:#000000"\n' +
  '     d="M 19.039097,494.38241 C 2.0018627,482.75861 -2.8301068,468.02182 5.0071177,451.587 8.2776829,444.72855 15.162733,436.35919 20.307229,432.98839 c 8.904129,-5.83422 9.948263,-5.67522 21.727331,3.30915 28.014638,21.3678 44.091105,18.882 51.54879,-7.97059 C 99.533959,406.9008 98.83533,123.18555 92.8125,115.28305 90.196335,111.85041 81.496733,108.63382 73.125,108.00381 58.734191,106.92084 58.077731,106.30388 56.961131,92.8125 L 55.797259,78.75 l 163.053411,0 163.05342,0 2.57381,11.71845 c 2.93006,13.34047 -1.71086,18.13302 -17.64754,18.22413 C 347.54041,108.80285 345,115.82292 345,169.01786 l 0,48.48214 67.5,0 67.5,0 0,-48.1688 c 0,-41.90267 -0.89209,-48.97614 -6.85778,-54.37499 C 469.37044,111.54279 462.75847,108.75 458.44894,108.75 443.44309,108.75 438.75,104.6341 438.75,91.473791 l 0,-12.723791 80.85139,0 80.85135,0 -1.16385,14.0625 c -1.13201,13.67745 -1.60515,14.09431 -17.27948,15.22432 -13.44982,0.96964 -16.73767,2.79799 -19.87627,11.0531 -5.80185,15.26002 -2.83763,249.42009 3.25016,256.74719 2.61705,3.14985 11.47643,6.80123 19.6875,8.11425 14.52533,2.32268 14.9292,2.79386 14.9292,17.41755 l 0,15.03026 -79.6875,-1.01208 -79.6875,-1.01209 -1.1367,-13.60684 c -1.13565,-13.59401 -1.11975,-13.60939 16.875,-16.30515 9.90645,-1.4841 19.25149,-4.64227 20.76679,-7.01816 1.5153,-2.37593 2.78092,-30.05423 2.8125,-61.50735 L 480,258.75 l -67.59289,0 -67.5929,0 1.0304,60.9375 1.03039,60.9375 19.6875,3.3399 c 20.4921,3.4764 22.16576,5.78036 17.32391,23.8476 -2.25337,8.40847 -2.53065,8.4375 -80.57378,8.4375 l -78.31263,0 0,-14.95567 c 0,-14.53673 0.41823,-15.02258 14.9292,-17.34297 8.21107,-1.31302 17.07044,-4.96657 19.6875,-8.11909 3.63727,-4.38139 4.7583,-35.56081 4.7583,-132.34294 0,-69.63615 -1.23091,-127.84279 -2.73535,-129.3481 -9.73748,-9.7431 -68.9232,-8.34789 -79.15408,1.86593 -3.08612,3.08097 -4.99292,46.77065 -6.52417,149.48557 -1.45514,97.60931 -3.64592,149.67975 -6.6905,159.01994 -13.55129,41.57292 -61.40288,74.9124 -111.000242,77.33685 -22.754302,1.11229 -28.166407,0.0821 -39.231561,-7.46711 z"\n' +
  '     id="path3338"\n' +
  '     inkscape:connector-curvature="0" />\n' +
  '</svg>\n'

beforeEach(setUp.beforeEach)

afterEach(setUp.afterEach)

describe('images', () => {
  test('uses the configured paths', done => {
    const srcPath = gulpConfig.get('srcPath') + '/img'
    fs.mkdirSync(srcPath, { recursive: true })
    const imageFile = `${srcPath}/imageToCopy.svg`
    fs.writeFileSync(imageFile, imageContents)
    const imagePath = gulpConfig.get('imageDest')
    expect.assertions(1)
    images()
      .on('finish', () => {
        expect(fs.existsSync(imagePath)).toBeTruthy()
        done()
      })
      .on('error', error => {
        console.error('Encountered error', error)
        done()
      })
  }, 10000)
})
