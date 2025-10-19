import MarkdownIt from 'markdown-it'
import puppeteer from 'puppeteer'
import { NotionToMarkdown } from 'notion-to-md'
import { convertNotionPageToMarkdown } from '~~/server/api/[content]/[...slug].get'

let n2m: NotionToMarkdown
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

// Helpers
const imageBase64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAEQLSURBVHgB7d3PjxTXluDxE5llqxfTelgjjTStkRzsLIsqqh7GW4K/wHjfEsmyV8Cmt07Uf4DxqpdOpO5VL+DtekewfX52lat4lneEF90jzWhkrB7NvLErM+aejAgqKTJ+ZsSNX9+PFC5MJkUCmXHOPffce0UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACscc31tbl+Ntcrc30hAABgsK5IFOw18IeXrgcCAEBd/rS/f+e7g4NX3+7vPxW0yZNotB+mXJoUXBEA75gIgFKODw7uOyJPwzB0zf/e0WRAYJsG9S/N9Vyi0n/W86gCAFuQAAAlmOD/xSoMH2/+nBMFIthzX6JRf9HAfl8AvIMEACjIBP+7JvjPtzzkfntwwCizea5EI35NwMqU9fW5dwXAWxwBkCsO/ouMp7yeTKdXj05OXgvqpgFcR/Fzqc43120B8AYVACBHgeCvrqzOz6kC1M8z17HsFvyT7+MJgDdIAIAMBYN/xHHuHx8e0nFeD1eicn9ek18ZNGsCG0gAgBSlgn+EKsDukjX9Our3pF53pftLApM/f7K0URMgT4AG0AMAbFEh+Ce0F+Do6OQkEJTlSbSTnyvNeSS7Tyc0IelzeCDvJim+0L+ABpAAAJfsEPwTixtnZ/cERbkSBX5PmqdNmh9Id2QF/k36mmkwRa2YAgA21BD81eyba9c8QZ7NcrcndlyRbpTUN//sc8mfmqB/AbUjAQBiNQX/tanjcBBNNg1odXT3V9H2v81Migf+xKEANWMKAJB6g3/CfL/bN1++9AWbXLFX7s9y1VyB2DWTKPlwpbxAotcM1IYKAEavieCvqAK8Jdm732a5P8tM7JlJ9OfepcHRFQ41Qs1IADBqTQV/FVK2Tcyk3N79NmjjXdMBdSa7B/5NngA1IgHAaDUZ/GNjH7F5Eq1j1wDYtb8LfT0zacZM6g38CU+AGpEAYJQsBP8x2zyq15Pu+kzqNZNmAn/ilgA1IgHA6NgK/qvV6qGMT9mjetvkST0JykyaDfwJnVKiDwC1IQHAqPzx8PCw8eDvOMF6BcCf//xYxsOTakf1tm2XRk1PLqY4XLHDE6AmJAAYDQ3+0+XyuTQoDMOvJpPJ0YiW//Wl3J/Gk/IJiycXBxV5YpcnQE32BBiBjeDfzOhUR/2r1b2RrfvXcv9c+l+W1umKeYHneRJVDDxpD30AqA0bAWHwmg7+ptz/yAT+uYyHJ+0HwjrpHvtXJX2vfU+69eflXADUgikADFrDwf/FZDq9OqLgr3+HOt/d13J/Gv1zbdtr35P2Sv1ZPAFqQAKAwWos+DvOa+3wv3F25o3o2N+ku38mw7SZAHjSzcCf8ASoAT0AGKQGR/4vJpPJ7MbpaSDj4EnU5Df0XQ2TUwL7MLVxXYAa0AOAwWkk+Ouof7l8NKKlfclxtX1Yzz9G9AFgZ0wBYFAaGvk/Wy/tG0/w79NmPmPFORPYGVMAGIzag78Z9YdheO+Ts7NnMg6eDKu7f8i0Z8EXYAdUADAIDYz8ddR/dSTBv++b+YwR+wFgZ/QAoPdqDf7jG/UPZTOfMaIPADuhAoBeq3nkP6ZRv2euY+nf3v244AmwA3oA0Fu1Bf9xjfqTcv9M0HeeucZSqUIDqACgl2oc+Y9p1D/0zXzG5jMBdkAPAHqnluA/rnX9noxjM58xog8AlVEBQK8cHxzcrWHk/2Ik6/o39+4n+A/THQEqogcAvaHBfxWGC6lqXKP+ZBc/GvyGTZcDLgSogAQAvWCC/xcm+M+lurHs4e9JNOp3BWPgCVARPQDoPBP8vzTBv9q2tOMZ9bsSzfNTEh6fq+YKBCiJCgA66/jw8IoJ3l+b4F81qI1h1K8lfu3up9w/Xvr5GMs5FagRCQA6SYN/eH7+3IzgKzWvrVarhyMY9XtCuR8cD4yKmAJA55jg74bL5fOwQmBzHOfkfDK59+nJyYkMlytR4PcEiJYBfiBASSQA6JRdgn8Yhl998vJltV6BfqDcjzRH5hpy0osGMAWAzqgc/B0nMCX/ezdfvvRluDyh3I90npAAoCQ2AkInVA3+Oupfb+oz3ODvSrSRz3Mh+CMd2wKjNKYA0LpKwX/4o/6k3D8XIB99ACiNCgBaVSX4j2DUr8u69KjeuQDFaMLoCVACPQBoTengnxzb+/LlUE/uc4XuflTnmcsXoCAqAGhFhZH/iwEf26ujN927X4/q9QSo5pYAJdADAOtKBf/hb+Wr5X7dwtcVYHccD4zCqADAqpIj/yEf2+tK1Nn/VAj+qI8nQEH0AMCaeHvfp6HjuJlPHPaon8180CTPXEPtkUHNmAKAFcne/mH+3v4vJtPp7OjkJJDh8YTNfNCsQKLTAYFcJABoXNHgvwrDRzdfvpzL8LhCdz/s4XhgFEIPABpVJPjrAT7L6fRooMFfu/t1Tb8ngB1Vj8/GyNADgMYUCf7rTX2m0/mnJydD61z2hHI/2sHxwCiEKQA0Ijf4D3crX23s08DPKAxtYVvgDtF7ofzlL1dkMrkiq9Xrox9/DKQjSABQu7ylfjrqn+7tzY+GN+pP9u6nux9t43jgFq2D/mp139wDZ+Z+5156+LUJvCdm6nNxdHr6RFpEAoBaZQb/4Y76PYk288lb4QDY8tBcQ908q9OODw7ursJQ/+6LDASCiePM20oESABQmz8eHh7uLZdPU0b+z8xc/72BjfqTLXwfCNAtvrluC6wywf8LE/znUl5g7o+3bS9/JgFALY6vXfNWjqO72r2d9Q53Ux/K/egy+gAs2yH4vxFXAx6JJSQA2Jl549+PS16XDXFTHy3za7nfE6DbtALgCxpXR/BPmO9z29Y0KcsAsZO0N76Z6384sFE/5X70jScdTgC+299/ZaYLfTNIeNTnQUI8AJpLTSbRCiJfLGAjIFS2Nfg7TrDe1GdYwV8/kLqZD8EffdLZ44H13hH3Cs3MFOEr/f9153zPrKc+t1c/q3Ocz8QSEgBUsi34rzf1mUyOPj05GcryI1c4sQ/9pdNVnQuqulLo8r1D/98kAsfaQS89sV7x5DhfS/2s/ZsxBYDSvr1+/WtT4p+9+QnHeW2C/71PXr4cyilknNiHIdD3riYBvnSICfRfpDykicHi2/39O2Za4GGXpwXWG50VP9a8LGv3HCoAKEWDv2wGf230M6P+T87OhhL8PYnK/XMh+KP/OrU3hQnuM/NllvO0O+tpgf39L3WULR1kXt/XYXNVQWtLpUkAUJgpz325Gfy10e/G2Zk3kC5/V6Jy/3Oh3I/hsDafXIQTNdIWsjIVODPKbqLEvhOd/pRmt/r+XiwhAUAh8Zx/1ASnO/rpUpXhNPppuZ8T+zBEnakAbDT+Fabb5UqH6GZndXb8bxWG1nqoSACQ61LD3zMt+Q9kO19XohF/0W07gb7R97UnLdvW+FfAi7b3yt+kfwbd6VQaNtnbszawogkQmTaD/8DW9nsSdfcT+DF0rTcCZjT+bWeqjGagMZMOif8MrjRrYXNKlQoAUr0J/sNb2687+enIn+CPMfCkRQUb/y44zmsT/G93qbeo9J+hCv1zT6fWtgFWJADY6puDgwfxyP/ZgNb260iIDX0wNq1tCKRl8zKNfxoElx0L/qX/DBWZCutXtv/cTAFgq5unp4+/uXbtZCBz/cm6/rkA46Pvf9dcgdi2Wt0v3PgXB/+uDTaslP5NlfXm2dlcLOMwIAwZG/oAkXvmWohF68a/5fJVoSd3NPjHpf/GlyKaJOnzNvZSYQoAQ5Qc3KM3n7kQ/AHr0wC6U16hJ3Y0+Nsq/RuLtjZSYwoAQ5Esd7ovrOcHLvPEoriB2M19YkeDv7LU9S+2G/82MQWAPnMl2ulMd+Xq5MEnQIdcFQt9AIVL/x0O/qWmL3ZgkqRHN1++nEtLqACgL5IR/ofxV08I+EAZnljoAzCB88vcJ0Xr/G/f6Og24oWnL3bRUuPfJhIAdI0r0Wj+w/jHenlCsAd2pX0AC2lQ3DSXvU9+HPy7eoaI/hlCG6X/DqxKYgoAbUiWJd2SiyCflPAJ9EAzAommARqhZfPcI3I7HvzjY36PLSQAixtnZ/ekZVQAYIMGdR0VXJdoNN+pI0qBkXClwf0AcpvmOh7818rsW7CDNhv/NlEBQJ1ciYL9YfzjD+MfE/CBbngo0eFXtTr++OPD1XR6nPqEHgR/W41/0pHRv6ICgLKS8r0G9evydsCnfA90m66aqT0BCKfT9FPy+jDylwoHFlUR/V10YvSvSACQJQnu1+OvnlgojwFoTO3VuMw1/z0J/vHofyYNW61WT26cngbSESQASLhy0X1PsAeGKVlO60sN4sD5YOuDPQn+ytbov+1lf5eRAIzP5RJ+MkdP+R4YB23I9aUGceB8994RbfLzeVfX+W+yNfrvwrK/y2gCHDZXGNUDeFsgNSwHzDooZzmd9uYIcfPn0D/DTJpkRv+m9N/YEsyqqAAMhytRgGdUDyCLKzUsB9SDcsJtDyyX9z49O+tF8B/z6F+RAPTP5iY6SaB3hWAPoLiZ7BCU0hr/1nvb//DDQnrC1tz/0enpE+kgEoBuowsfQBMqHw8cj5rnl38+DMOv2jzYpqyxj/4VCUB3XD7sJhnZA0DdPKk4DbBt1GymAp588vLlA+mRsY/+FQlAO1yJAnyyF74nlPAB2KWrAUptCnS8v39ndalhznGck8lk0qvgz+g/QgLQPFcI9kW8NtdX8df840QB7MqVksJLn00N/k601v+19Aij/wgJQL1cIdiXlQT+x/GPZwKgc44PDu5vNv71Nfgz+r9AAlCdKwT7XS3MpftiBwLAtqDoE+Ojft+U+fsa/JWt0b9MJi+k40gAikka9Aj29dAPxlxq2o0MQCV+0SduHvXb5+Bva/QvYej3YQtkEoDtPHn77HpXUIfAXHoMpp/zHADNWpir0GY9m0Gzz8F/bbW6KxZMptPOnPiXhQRgO2104Qz7eukHIpnnz9LPGwvQH4FEn8dCTOn/uX7tffCX9V4FM2neog+jf0UC8K5k8x3UQ8v9OndYaLQhJABA0z6XgpU23e8/NBXQIQT/5M8iDVuFYac7/zdxGNC7XHO9EtRBRxlzKS8UoPs0GP5krmNz/RL/3H3pttKfyT/t79+ZTqd+n4O/+m5//1XTCYAmSr8/PT2SnqACgCYEkj/Xn/frXQG6IQn0vkSVLL0CebdapdXDLicAutx2LiV9cnb2THrO1ujfKbmxUttIAN5FCXo3WvK/I7v9PeoN1hWgHRrsdd5b34cvpNz0lT63i1OIgURTcaNkAvPdxsuKPdj45zISgHfph9iXaAUAytERRh03mZ8EsEM/799LFLj9+NoledWEoWsJQGCu2zJSx9eueSsL9/M+bPxzGQnAdn8QEoCyCs0tHh8eXpHz80PZ2xMzp+inPC0QoBka7HXOXgO1L/W/14pWC2wq3PQ3RCvHsbL0rw8b/1xGArCdznmxH31xOt+/SHtwHfRXq/thGHqr5dIzpTKR5VKf76f8kkCA3SXVPL2SUX7TU3y+dMtD6WZSYoW1jX96tPRvEwnAdoHQiFaE3kx1dOFvezAJ/KtoC9G3dk50HCerTDraGxYq2yzlJ+X8QOwLpDv3juSMjdGysu2v9Gfjn8tIANLpNEDXl/S0SW+4Oq+4NViv9w4/P38apgT6cONQkZTvDaTpSrBPo6VgV9qlfy9l+3E0WM4k+lwH0nMWR/8v+jj6VyQA6RiFpssP/svlcxP83YzvcUWfl/LB0e+vP+8Kxm7bEryufzb19dmZd94ukKgyV8ZMLnp47sgQKge2tv11nK+lp0gA0vmCbYoF/2LB+0rGYywFHKekSa/sErwuabuHSHtyAilns1R+XQbAyra/PVz6t4kEIF0gUbC7ItiU2VQUl/1dKWD166+HGd+LpYDDt7ne3laTng2BtHfv0LloX8p5c9JfTCsA96THbG3808elf5tIALL5En0YENHgv0h78Pjg4MtVGBZfAz2ZZD03EAzJZkd+UtIfcq+H9hDZngZYSPmAdGfLr0nOQ+ntNKhjkhor+4n3cOnfJhKAbMmudrg4zW8rE/zvm+BfrunIcX6X8Wgg6KvL8/b6NZBxsd0HEEiJE/5irrnS5q896WkCYGv0Lz1d+reJBCAbjYCRzD3E427buZTnZTzG331/DLWUvwubfQBJX05Q4te4Ev2bpU1TeNLTRkBbo/++Lv3bRAKQLbmRjbkPIHM5ka71j88Lr/J3lPVrAkEXdX0JXlcEYm8lyyMp/2/wVLJf2y3poXjbX1ea19ulf5smgizJ4R5jFUjecqLV6osdym3rpYCS/fujXTq6X0iUBOoo86pEo8MH8c8HgjR/kOZlTs2l0MpEXq+OJuee9EzoOHY2/unx0r9NVADyaR+AJ+OUWVbUubbS8/6XLJfLw4zfg6WAdjG6r5dOAzS5mVgg5Zv+9PUU/cx60qPl0PFUpCdN6/nSv00kAPl8eXuN7FhklhXjD9vOc5zOauVmPMxSwGYNYc19lzU5hRhI+RP+NNkuUy3o1TSAtW1/e770b9NYEgBXomz2evxj/SBckYsPpi5vS/tgjPGmuJCcN/kO8/5vm0yyNh0hINWHRj37kilET+pXdrMfV6J5/zI8iT7jnX+fWNz2t/dL/zYNMQFwJQrwt+KvSbDP8pmkJwDJ+mVPxiGQnOVExwcHX6yy9/IvjEOBGjG2Nfdd1sTR4lU2+8lr+ktzKD2YBrA1+pcBLP3bNLQEwDXXKynPk+xMd0x9AHPJKv1rl20YzqUmOYcCBYI8SbDfXHcfCLqi7iRW+wrmUk6Rpr80d6TjCYDN0f9kOv1KBsSR4flZqpWms6YBPInKp0O3kIwtQEvu81+Y+VBdzciqNaFzBYomvX6qek+6LDDXkZSr5mjTX5l5/22/51XpsG/397UjfybNe3Hj7MyTARniMsCqS28+y3jMl+GXUAPJKf1rma2JHbbilQBpxjwNsLkET2/8HwhL8PrIl90lm/2UuQ+5svtmPq50OAGPlxHPxIKhLP3bNMQEoGrAyOsV8GW4tKylASZIe4Ju9SsNfdBYCbCmN3adatIkTG/0GuxdiSoy+u9DP0R/1dE0pklfUOL5rtRXtbwjHWVt7n9AS/82DTEBeCbV5G18MZjOz1gSbDTQ6M0ldWSxnmOrcd7/HeNcCZA2up8LTXtDU/WelNDPadngo6NVV+rxmXSQzdG/REn44AxxFUAg1dfe6hs97cO6kHbP+N5VMn+s3cBPpESAqW3JXzov47EhJACbc/e+EODHJpDq9yR9z8ylHB0Ve1KfpDraqfesxc5/M0aZ7JrEddIQmwCVBrkqZSt9g3+Q8bhumlK1m7YN+ufRN64G/ErrvuMlf3Np2GQ6/eDo5GTb69Mbz8/SLxrsfaFRDxcWUv50wEDKH/Kj972y6/2L0NfhS0fEnf9VVnxVsbhxdnZPBmioGwFVPcY3mQbwM75vHxIAfZ2lR/qX/fHw8LDiKX+lnZ+fp6031tcfSHcbkTY32NG/90AY3eNd+v4omwBU2eynqSplp5YDWh39D+DUvzRDTQB8qc7L+PU6mm5yb+9daNDReSp9jTuXzeMlf09tHKupJmGYlgAoDayutI/d9FCVL+VU2exH35uuNEOTlwfSAfGJfzOxYxCn/qUZagKwyx7cWftf+zt836bUMtrfpB3/8cjf3p/TcdyMR6uMnnZFsEedytyTFlJtsx9XmpNXHbUmtLgcz8b0Z5uGfBaAL9WmATzJbng5kW7sCqiBfy41fCCPP/rIXb33nidR8nPHvOntJziO87uMR3euaOQg2MOGIveOQHL249iizAl/u2h9GkBPIA1tVQMdJ7h5dubLgA05AajaByDxr1ukPNbE3t5l7Bz4TXn/iiyXWka75TjOnbr29d9FmN18WWcCoMFemzl9YZ982FXk3lG26c+V3Tf7KUpXSbU6DeCIfGFtWnJAp/6lGXoFoCodCS9SHtM59jaWA2qQ0pFBpQ+7jvLl/fc/C8PwzuaZ2eb/pQuc7NKo/tk1CTiUclh+hy7JS2R1O/JAinPF7hblrkSfwaYrclvVeQhZroFu/HPZkBOAXfoAtAKQtuwjEPtd6YGUHxnI8ccfH8re3mcmxM/WH5yOBPuKiqzASEr5+lxfWH6HbskKnAspn9xXPeFvF560kADEy/6sVR/GMPpXQ04AlC/VlwO6kh5AbHalJ1MZhUau6/L+anV3PdLXD2t/gv6HOY8nNx39e/gl/rGuA05G+M+E0T26La2SFUj5ef9dTvjbRdbR6Y2Jl/1VGcyVN5LRvxp6ArBrH0DaG90XO13p+iacFXliHPjvx1mynQ9KvfJe80LSp2WAvthWySpb3dNg2NZcvPVdAbWSaXHZ32hG/2qIZwFs8qW6rP3pn0nzdKSQ+yHXwL+eG1suX8VLVvoY/NWVdRIDDNvl8rmO/AMpzpN2A5R+Rq1WHsLptImdDbczo3+ZTIZ27kuqoScAuyznyqocJLvTNSUw1+eS89p1Q4xwuTzueeB/Y/XbbzMBhs3f+LHen+ZSnCvRIT9t88QSHdyEFvscVqvVkyFv/HPZ0BMA9QepJukDqPv7FjGXrKN5o1H/lyvHeR7abwJqjDOZdPLUMaBGgVwMID4v8ev0ftTkTn9l3BILGj+F9DIz+t/b21vIiIwhAdilY9WTZr5vloVkHP2pwT88P39uPhhtzQE2xiQznklsbO/4B9ime15clXJVxDY6/tMkfQCNMtVNq9WOsY3+1RgSgF3m62819H2zZHYDa/APHaeN7l8rTGLzmF4A4C3a8e9JdzTeB6DbkYc2/8y669/Ll3MZmTEkAIFUn6/3Mh5rog9gkfU9tew/5OAf010KrZ30BXRcmx3/WaqursplvfQv4+r83zSGBEBVna93JbvUVXcfQOroX/fAHmLZf5uVueGZP+8rvREIMF4aZOfSTY3165gqp0532KsCjmjd/2V9SQCSk6i0FKZvDt0A5mdZTxuvr59zfr0v1XkZj9XZB6DJRJD2oBONBMZEd/46picAI+VKNzr+07jSQE/CuuvfcpVzrKN/5Uh3eRKtxdcsuEjTiW6m4ac8pr82L0lI85Wkl+B2+b6XaUfw1r4CHf1Lt28GTVtMptNHY2vQwWi50p2O/yx6dsFjqUm83e8rscmM/m+cnl6VkepSBUCDvB5rqSN8Dar6AdA3lyfFykF56/Z9qeZWzvcNpB5+2gOO49yXcZuZG8NzqgEYAb3XdanjP0tt0wAa/EPzGRfLlufnZZZiDk6bCcDlgK9HtGrA10BeZf7nbs6vq7q7U171oY5do/R7bN30Z/3BCMOhN/4VoY1BC1MN+ZreAAyYVvr68nmvbTmg7vXfwp4mi09/+KHOadzesZkA1B3wL8tbmuJLdZ40831zv8dyuST4v41qAIZK+3wa665vQN49txCd9xeLe/2vOc5rnVaUkbORADQV8LfJCgq+VN8W2JPs77ur1CzUYfS/zboacLy//6UAw+BJP5vRdkpYdDtz20v+1Gq1+oqeIjsJQJMBf9vvlaXqUo+sua5Adu8DCNIeCB0n61CiUWO5IAakr02+le9P6+lNx7H/5x7ppj/b2EgAArEnWS6Y5plU40qzfQBB2gOTARzy07D1csFvDw4eCNBPM+nvmR6eVLhHJU1/bZxlMvbGv002EoCqZfeqsqoATZ0OWKWRRF+HLjG8Lfb/jobmioThl3GDIAkT+qbv/Sylpyl1s5+WDjIbfePfJhsJgO2zlbPK9Rpoq/7jZy0H9CWf/t5agdCR6pFEB4I8kHp6CBCZrTcPYkoA/dL3AUCpBKC1Lc1N6Z/Gv7ftSfNsZ1tufAUpj+uOe56UpxWAeymP6Z/xe4lKYfphfiUXycZP8ddAGvZf/+7v5K9v3pRf/+3f5P/9+7/L//7Tn+T//vijnP/Hf8iIrDcTMTeZ+dHpKR929MEv0m+F+wC047+tLc11xz8a/95mYyfAOnfLKyprhypXogBdRdZug434bn//edFTsT78h3+Q//zZuwUQTQT+1x/+sL7GxLy5fWc6vceHHh2nAbHPK1oCiY43zhQH/7m0IAzDrz55+ZI+oUts9QD4YldWRhpIM6cDNiKsYZ3tf/rkk3VycO1f/3VdJRgLTZzYMwA94Eu/5a6uajP4a+l/urc3F7zD1kZAtoeeecsBq76eW2JRfAZAbU1t7//N36wTAE0EtlUKBoodBNF1VqYIGxBIVBWdZz2p1eBvTCaT26YKSKP1FrYSAF/s0qDpZjxedTmgJxaW5enmGFr6l5Jrg3818/5FaCKQNl0wYNog+GqdCOzv32G1ADqmb8fRanN37pRo28Hf/N4cIpbBRhOgSjJcV+zRKkBaH0CyHLBKEPCkegKRKV4b+/WqhamGEZmtdN31cinfHRycmLnBQPS9GYa/mJHCzyv9qu+NMIxGDOfn+rgc/fhjIEBz9F6lW6X3ITEtdApg28HfeMaGP9lsJQBKy+42T7XL6gNIOvQ9Kc+TBhIA82G5b0aoc7F0A9DGwP/45hsZs/iQpajHwnF0tLD+4Sr+/7X33lt/MZWD5Je9dhxH3z9vkoQwej8lP/dL/P0CEgmUoO8TXbXS5WbAQKKVUH7eE3WpX1vd/mv6+ZtMHgoy2VgFkPAkOuLXFv1AfZDxeNXO27zvW4qWos0H5UtZrWayI53fz2vy08D/3//xH0cf/DtgWyIRrB8JQ106KlQkRsmVaE79lnRnd0At9+t0ZH6zn7mfmSrm07DNKqYe9DOZHFH6z2czAdCR7SuxW+LSpSlBymM68juW+r9vYXVuh7n3138tH/3Lv6zn97ch8A9WbiKhoyH9MommO/QklNfr66/+6jXNUZ2W9DJd2fh/m/fPZOq20Hukze19N61Wq4c3//zn3CkK2E0AlJ4MeEfsyZur0v0JqnygCs2BZfnj4eHhXpQpu7Ij3fxHm/q2BX8CP4pw4iRB4iQhbVpDv5BI4LL1qX6Oo/f3VnsYtOmPef/ibCcAM7F76tVC0nfvSx6vskbcl6gDtpI/7e/fcaK/h50/LP/lb/9W/tvf//07P6+b/vzPf/5n+T8//iiALXEikdofwbTG8Kz7l8KwCyPuZzfOzjjopwTbCYDtXQHz5utnUi0h0e97VSrs4V33h0WX8umlo39dBqgj/f/xT/8ky3Ft/4thSZvWoMmyQ9b9S8ul3j9tVnW3i5r+jqhElWM7AVDaCOiJPXrwzknKY7skJKW3Be7AshhgFLZUIpL/f7cKEU9lkDwUF29Spk3UrZb816Lgf5umv/JsLgNMaEepJ/Z4kp4AJMsBD6U8zXr9ok8m+AP2hGHobn1g23LP6XR9JUs9N5OH8GL64k1D5VgTh/XmWavVXfN3eyfsyl4lBP+dtFEB8MTuckBfsufrkw04ytLE4ajIE7U7VnehEwCDtaWRMvn/zNUYXU8g4gY/7ZXSQU/7I/4EwX9nbSQAqmr3fRV58/WeVE9IPpACfQBlTvQDME5ZlYdk2mL94ySBSMT9D1tVWKFx/NFH7uq99zyJNlObSRd3JyT416KtBGAh1brvq8qar99lfwJdYbDIe5IpLdpMeAAg15uKxYbUqZMOMa/7xJlMPif4787WYUCX+WJXVpdq0gdQRbHegTD8SgCgQzTYX76k40xl5InDyL82bSUAz8SuvGPvqh4PXOg4vcnenvYZsDwFACrSHf4+OTubsdSvPm0lAPoP6Is9rmTvuOdLM993Td+wK8d5JACAcsxUxXI6PWJ73/q1lQCoqqPuqrKmAXQKoGpW6RV50s3TU33z2q58AECfvdANfj49Oak6TYsMbSYAQ5kGuFX0iZPp9N62xhsAwNt0X/8bZ2ceJf/mtJkABFLDiXoleJLdiV81wyy8Daa+kZer1T0BAGyn20Avl/c41Kd5bSYAyvY0gJfxWNWKRHJkZyHmTe2HrAoAgHfpfP9kcvvGDz8sBI1rOwGwPQ3gZTwWSPWKROEqgPrk5csHupZVAACReHMf5vvtaTsB2KX5roqm+gCul3y+6EYWwtJAAFhv7sPOfva1nQDssglPFa40sxzQk5L0jc7SQACQF2zu0462EwDVpT4AX6pxpUQfQEKXBjr2d0UEgE7Qnf3o9G9PFxKAhdiVtWxvlw2KPKnAmU7vCVMBAEZGm6F1Zz9Ba7qQANjeFTCvYe+FVFPsXIBLtOwVRocKAcAo6Bp/bYYWtKoLCYCqGnSryFu250s1hc4F2MZkwc9YGghgFFjj3xldSQB8sSurCuBLtZK8Kzsc+Tvd25uzNBDAYDnOa93TnzX+3dGlBMDmPHjesj1fqim1H8AmbYJhaSCAQYrW+JfZ09+Tin1VKK4rCYCyuRrAy3ncah9AIl4G81AAYCjMyL/EGn+toj6Pr68FjepSAuCLPa5k9wFU3aGwch9A4sbZ2UIbZNIe5zAhAH0ShuG9gsHfNdexXAzQXKEK0KguJQC2twXOKtcHUm1bYFd26ANIaINM2v4A4fn5o8l0etV8qh6xhwCAjltok3OB57kSjfrdSz9feVoV+bqUANheDpjXB1B1SqKWN6wznX6+bbS/mkwCzaZvmCTh92dnt03FwDEVg9tvEgI9SQsA2qbz/tNpkd1Ok7K/u+Wxu4LGdCkBUDaXA+YF6qoViZ36ABJxU+Dty0nA3t7eO000esLgm4Tg9PQDTQgmjvOAhABAW1ar1ZOCpf+nkj4lq8mBJ2iEI92iwfNY7DmS9LMI9I33SsqX9ANzXZWaHB8euuFq9dzMo7n6/zril5K+uXbN25tMrpvvcSd0nENTLdh5mgIAUpmBixmMFLkPziS/2U/3SGHToAZ0LQFQP0sN8+gFacf944zHtSzlSXn6xg+kJpoErJZLLzTTJAXn0zJpQmBKP56pLtwKya4B1MxUIGdHp6dPCjxVR/951dhAahxU4UIXEwANyPfFDt9ctzMe16zzSykvL7HoDJNcXFma5ML88M5EE4K40gAAFb02c/9HBcv/RQdZtQ6qEOliAuBJ9Kaw5QNJ33yn6pSEL9mJRWf98eOPD6eTyR2qAwAqCsxUZdERe5EKgNJmwrmgVl1rAlQ6J2+zcc3LeKzqa9HEoZfz7J/+8MNJ0lCoyw31uE4BgGZ8X/B5twS162ICoAHX5p74Xs7jVZYDavCvZTVAm7SEp8d1miSALYoBNMEv+DxPejqo6rIuJgDK5rbAeetMfalmMBtYxI2HbFEMoG6+FB9csClQzbqaACzEnrx1plW77gdVstItijmyGEABV7S5uMTzi04zMg1Qs64mAF2aBtDXEkh5ve0DSKNHFgtTAQCyXZHVqsy5KH7B51EBqFlXEwBlc1fAvMyy1W2Bu0J3JxSqAABymGrhrMTT/YLPY1fAmnU5Adh5w5sSPMkerftSTe8bAS9b7u3Z/HcB0EO6hFg3MCv49DIVX09Qmy4nAL7YLTdnjdZ9qWbn44G75tOTkxNOIQSQZ/Xbb2UqoEUrvvQB1KjLCYDyxZ6s0XrVkwpdGeDSFVPeszk9A6CHnMmkzACoaAVgcL1Vbep6AmAz0OS9WYtuWHHZ4BpXJnt7CwGADGG5KVC/4PMGscdKV3Q9AViIPa5kZ5atHg/cJbpBENMAAHJc0YPHCj43EPYDsK7rCUDV0ntVWW+sqtsCD64PQDENACDPJAzLDICKTgNcF9Si6wmAshlo8voAquxN4MoA56yYBgCQazIpE6yLTrN6Qh9ALfqQAPhiT16HadVkxJOBYRoAQAFeief6JZ7rCXbWlwTA1nLAvA5TX6rxZICYBgCQwy2xH0CZCqsn2FkfEgBl83CgrGmAqn0Ag5yzYhoAQJ7Vr796BZ8aSPH7K/sB1KAvCYAv9mQ1AlbtA/BkgHNWTAMAyDWZNLEckP0AatCXBKDqErwq8kbrVcveg1y7yjQAgEyOU2Yl1E8lnst+ADvqSwJgczmgJ/QBFMY0AIAcbonjgX0pjv0AdtSXBEDZ7ANoYj+AQc5ZMQ0AIM/q11+LBmtfimM/gB31KQGwOQ2QFayr9gEMtlzFNACATNNp0QGQ3l+Dgs+lD2BHfUoAAin+xthVXrZaJeANdg9rpgEA5GjiZMDB3lNt6VMCoGxNA+gby8t43JdqPBkgpgEA5ChzLkCZCisJwA76lgDYnAbwMh5jP4BLmAYAkGVSfABU5j7vCSrrWwJQNfBWkbV0ZZf9AAaJaQAAmRznbsFnBsKGQFb0LQGwuRwwr8GkyojXlYE2rTANACCHW2Ia4EnB5+n91BVU0rcEQNlcDjjLeMyXalwZKKYBAGSZFG8GLDMNwH4AFTnSP5rx/Sx2+Oa6LfW+jofmeiw9dvzxx4eyt3drFYaHjuO8VSkxSYArALDd68l0etVUDPNK/HpPeSXFKqYLc90TlLYn/ZNMA3jSvCS4va7xdfSuEXC9i9dy6a2i+bbZSv9OwnD9WBh/BYACrizNvUTyR/h6f9VpgPuSzxNU0scEQGmp2ZPmJetM/ZTHv6/wOnqxbOX4o49cef/9z0yAv7NaLtlwA0AtJlFQL1Li1+cUSQDc+AoEpfRxCkB55noudnxlrgcpj+nc01MpRzPbD6SDjq9d81aO85kp69+hlA+gKWb68PbNly/9Ak/V+7xX4Hk6BbAQlNLXBEDp/LuNUWlgrqspj1XtA7gqHchWtbRvRveaxOiSR08Y5QOwQFcM/f7s7HaBp3pSbLCXNVBDij4nANpIV6Q8VAcdsac1rWijiivlfC52NzV6Q0f5MpncMiN8L2TuDEBLaq4CBJI+UEOKvvYAKF/sJQCepAds7UdwpRxXLFk38J2fH66iM7nfauADgLZMJ5MvzZejAk99JPkJgCvpDdtI0cd9ABK+2ONmPOZLOT9Jw8sYtYHv+ODg/nf7+89Nif+VCf6aQWt5jBI/gE4wVcjDbw8OipTtfYlK/HnYD6CkPk8BqKINIrvSDHSe8ljRE6mSYy4byVAp7QPoId0X4Eh3Es15nt5njyV7MEYfQEl9TwD0H/tLaV5rc/ZZkq59iXYsZHQPoHccxzlxJpPbBTYHciVKAtLudSdSbEoBsb4nAK5ETXhNCqRDzSUEfQBDY+aiHx+dnT0s8FSttmrlN+3el9WwjUv6ngCoKl34RWmD30xaXrJH0AcwdBPHmR+dnj4q8FRNAnT/FXfLY51YYt0XQ0gAmlgOqBnkI2lpz/7LnftC0AcwAiWSAFeiSoB76ec7OV3bVUNIADypd1dAbSSZi8UyUhLwN5r42HoXwCiVSALU3FxfbPw/OwKWMIQEoMypUVk04Gv26EuD1nvsv/feoTjOh8lperocRgAAiWAynd4usDpAuRJVa7ViSgJQwhASALXrcsBAomN/A6loHdgnkysynbrxZjuuBnnz0BUT5F39yv76AFDKwiQCjwomAl781RcUMpQEYNflgIUbRy7Nz7vxCN4VAEBTyiQCKGgoCUDVQ3lU1iY/b5jA766WS202nAnz8xgTx/lp/TUMXzvx5yzcljCH4U9SURhVyn735rfcaO4KHUcT9N+Z78/nDiQCNRpKAqCqTAMEkrPGfz3iX62+MPP17DCFYdCAboK5RL0zr9eB23ECfci8z4O98/P1j49+/DGQjtGptvO9Pa28XXG0d8Zxrjs6vWYqcSQI46GnCZp//0dHxQ4TQoohJQBzebsbtIiFRE0jW+moP1wun4cWD+8BSolH5+Zm+CqMGllfmympXxz9cU+Cel3++PHHh2Z06JpEwDMJgmd+6rpg6AJdNSCTyQuqAuUNKQHwpPxywNQ1ozryN8H/mOAPK94O5MH658zIfDKZ/GwC+C9hFNhfjyGQ1yWetlufjeFozw4VgqFbTMLwCVWB4oaUACidnyzzIdfOf3/bA9/u78/Ml68F2EVUbtf9y9+U2jWYm8AUvLdavZa/+qvXBfZARw3+tL9/x3y5Y256dwVDplWBx6Yq8AeqAtmGlgAspNyHO7X739wsFtwoUNL3ZpTu6+Emy+Xy5L333w8I7t2TVAbMv9MXrOAZtnWvgMhXR2dn7A64xdASgJmUG7WnHhxBAoBcjvM6XK2emK/+dDr1Cfb9o5U+EoFRCOIdBp8I3hhaAlB2OWDqn58EAFvFQd+U8Z/dZK5xMEgERoNEYMPQEgBVZjkgUwAo6sUqDOcE/WH75tq1uQkQZVcToX9IBGR9DPPgvJAaONE6aYyZGe2boP9oMp1+cOPszCP4D5/5N56bf++rpsLDCHHYXPPZXnx37dqx9oTISA0xASjT7OGmPuI4J4JxSgL/ZHJVAwJz++OineOfnJ3NzA/vOfFeChgm3UBqtVy+Oj44GGXVZ4hTAKrocsDUk6PiTuFXgvHQwL9afbW3t/eYoN9brsQbIkkN1puBrVZPObFz+NYrBqbTe2NaOjjECoAqWr5L/VDHbwKCwEgw4u8lVy5W/miyHsZfdQCgey/s3MOj94Hfn54e6ftDMGi6YZQZ9D3XHSVlJIZaAfCk2K6AvkSbAW317bVrj82o8L5gyF6YOd8ZG4b0glb1dDOfWxJ9xt0Cv2Yh0YFfgewo3hzsS+EwsOFznIc3Tk8fy8ANNQHQD+grKfZBTd0L4Jtr17yJ45TdXhj9QFd/9+nn15Mo4Gvgd6WawFwPpVx/0FbxlMBzlgsOX7xKYNCVn6EmAKrocsDU8wDUd/v7ehiQJxgKAn93acDX8utnEn3m6i7FziWqBuwkPiTsa+4Lwzf0JGDICYAe3/tlgedp8P887UHOBBiAePOe1Wq1+PSHH1jd0S2eRKf26QhfA37T5XX999fPeyA7Ys+AcRhyEjDkBMCVaBogj5b/r0pGw993BwfHne0CNsFtfchMfLb7m6NgY8lpcm+eX6B0aUY2VxzH+d1bv81G+TXUaRPHuRJ/vw+lixznJxP0n7FjX+fo+0ab8/TzdEfamU8PJKoG7LzWXw8YMgHiS6YEhm2oScCQEwClQdEt8Dz9h52nPdiZXoDoZLnn5rWc/HZ+/qJLh83o8cnyl79c+W0yueLoZRIE8+a6Yl7r78zI+4ONpGL98/praksk4hP3zE34Jz2IZ/Lbbz7H5XbGZll/l3n8JmiT10PZUbxkWKuNdwSDZe5ls6HtHDj0BEA/4EW6+HOrAFbLfdGo3teANp1MXp2vVt/v7e2djGV52vFHH7nbfv58b2/983vn58H6JzhKt6s8sVvW30Ug0UqgQHb0zcHBg0kYFpl2RE+ZaurtIVUUh54AeFJsOaDKrAKoRpKAjVH9UgM+p8qhf1y5aNzTq4/L5LQSsPOyL1YJDN7ryXR6NJRlw0NPAMosB9SgeyQ5I4GdTg3bGNlzhCx6zJUo4Lc5j98EbQjWRCCQHWk1YGqqjyQCgxTESUDv791DTwBUmdMBfcnYGCihWf75+fnMlOfvpn7A43lpc30fmtH99LffTpiXRk9poE8239FrKAF/m0BqahDU+8RyuZxzquggPbtxdva59NwYEoAHUmw5YKJUY5A2CCYNb6GpImigZ24aPTemgJ9mITXtIKj3CDNY+JpqwLAMYWXAGBIAvXn9XO6X1LNhCNATBPztAqmpGqB2mj5EN/V8y+AxJABKDwYpu45/LiQBGCZXhjmH35SF1FQNUCQCw9LnlQFjSQCKLge8rLamoIL0RuxKdGPWNfN6ToFWL3SjnxOLrwPDkhyikyzNcwVl6ZSe3kdqGxSQCAxGb1cGjCUB8KT4csDLAqmxDLiFJ8X3Ps88twDY4MnbZX3UI5Ca9g1IrBMBkbucLdBrujLgdt+SgLEkAEpH0ruUOn1zfSX1BWCtSMyl3GvypcAqBYySK5T1bVpIjdMCKlk1MHGcW1QFeql3ywPHlAA8lXq26gwkCsRP4h8HUk2VaQl9Y30gQBTwPbkY5bsC2wKJBgW1N4HpGQPx8sE67lmwRLcidyaT231JAsaUAJRdDliG/mMH8dfkx5ognGT8mplUO2VQKwC+YGxcIeB3VSANThNqMmC+3KEy0Bu92SNgTAlAleWAu9CRwYOMx7VUeyzl5W5ZjEFIluZR0u8P31z3pMFm3T9+/PHhdDpdH65kRpuHvUgIdAdUkV+cMHwVmr8bPbFUzzjRU0rD6ATT12/O9zAub5iWnA3y1kFjejqr41yP91/xpHsWJgm4Jx03pgRAVVkOWFVeub5qQuILfQBD5El/DtBBtoXU3B+QRk/hPD8/P9ybTK6bgOqtA6JJDCQM7bx/UoK7nmuyWi4DWyeW6mZL+ndgfv87HUoIOp8EjC0BqDLvvou8cn3R44o30QcwDJ4Q8IduIZYSgcs0Mfjt119dHTGbqQNXkkqB46yP3XZy7jvh5mvWs0uiX7v+OZNoBOsRe0d3PH2zBbPjfGYtEUrR9d0Cx5YAeFJ9OWAVeeX6qo2J9AH0jyv9PzEP1SykpURgzDQRMFUIr+29FrqcBIwtAVC7LgcsIzDX1YzHqzYm1nJ0KRql77H1XK2w+Q4iC4kaBX2BVR3YdKmT0wFjTAAWYvd0Lk0AgpTHPKlWkfCFPoAu8oSyPvL5cpEMwJIOnM7YuSRgjAnATKotv6sqa7RetRGQPoBu4BAd7CKQaIrwhTA9YE3LpzM+m0yn97rSOzHGBMD2ckBfskfrWgHwpDz6AOxKSvpJwGeEjzothOkBa9qsBsSbBX3ehW2Dx5gAqKpBtwrN9K7GX7epujKBPoBmaXD35GItvidA8wK52Hb8RAZqvbZ/b8/VH68cx53o/TEMs0fF8V4Bl/cJ2IWpBujWy1+IfZ04O2CsCcDcXDb/0bNG657QB9AFm017ntjbLwJIE0h09kjerqKdp8sSZbW6G6/T37l65uiSxDAMzPc6megUynTqVy2ra4Og2J0WTrSeBIw1AfDE7nLAvF0Bq6xMoA9gd55wYh76IZCLM0h86ZE/Hh4e7i2XT8OGV8KYYOabxGBxdHpaurky3mFRY4Ltab3ATEV8/ukPP7SS4I01AVA2lwPqP+5RxuMLqTYXRR9AOa5cLMtjDh995ktUHfheovuLjaYyd+Pa9nqCbb9I59vD1eq5xaa7wJT1FzKZPCkzum4xCXhtkoDbbSQBY04Aqs69V6Wj9bQP6UyqlaDoA8jGWnyMhd5bkkQguc/8lPLcD6UYd+PrFUkPjHkVzjaSABXEm/AUrgiMbTpgzAmABoSnYo+u/1ykPMa5APW43KnvCYAmaOXBl6gK4Rf5BS0lATIxg6Sjs7OHRZ//zcHBg0kYNnVybBZNAo5sLhEccwJQNehWtZAoCUhT5aAi+gDensenrA80Q6sJWh7XPQs06FcKUm0lAeI4D2+cnhaulra1OkD7GH5/dmZtUDfmBEDZXA4YSPa2wFWnJLS3oNcdwiWwFh+wQwO8H19/kBo3KmopCXhtRtdXy4yuzXRA1bNadlMyWdnFRMbtD2KPK9lz0M+kGk+GK1mLr5m4Jmuv4q9zYec9oE4aGHV0r3P5OgLVyuLnEs3vB1Ijned2JpPbTny6oCVXZLksNaLXHfssv8ZIGH6xXjZpwdgrAK5EQcWWJrYF1iTGfpbaHE/YTx+wQQO+H1+2VhK80UYlYLlcHpXptm9tZUAYPrrx8uVcGjb2BEBpAuCKHQvJ7gOoMiXR9z4AVzgmF7Bhs3HPesDfJj6yV/ufrJ3QWrbRrqWmwNc3zs4av6+TANhdDpgXrOdSbYfCPvUBuPJ2454rAJqgjXtJsK/cuNc0PZxn4jjWNmar0mj33f7+89DydOsqDG/ffPnSlwaNvQdAVZ17ryJpYkvjSzWedJcrF/scvIqvr+OfcwVAXTTALySax9eGYzf+8UI6GvyVBrmV4xReprcrDeTf7u+XWuvvTKfaD2H173Bi4b5OAmC/FOZlPFb1tVyX7tAERysq+gHTngYCPtCMzcY9DfhaXdQpxtob95p28/T0cRiGX5X8ZbuYlUkCdMogzJ6+rV3oOIfSMKYAIjaXA/pS//HAgWQvMWySJ1EC4glz+ECTNOAn8/jJNSjfHRwcm0Sg8cC3YWHm2gsHdstLAwPz2hq9r+8JlHbSe2JH3ptbM3pPynElCrw2KhnJOny69IHmda5xr0nOZPJ5aLcpcHZ8cBAcnZ4+KvJkXRoYrlaH1jcyaggVgIgrdpcDNnE8sM5RNdHPoB9EDfZJ0CfgA83RAK+f45123OuzNrruyzTcWWxabLwCQA9AJBC7XfRexmNVs/w6A7MnF5vv6Dx+ModP8Afqp8FeR6DJBjzJuSGjC/5K+wEcy9MbJqAX7gfQRMFyv0JjSAAuvBB7bmU8lpzqVZYr1SWNezq/pQF/c7c9APXabN7TgO9J9HnzBWuOKbWL3QTINVMBd4s+ebq3N7ewS2DjAy4SgAtNlM/T5M2dV0lGPiz4vKSkryW2ZISvc26PhRI/0BSdy9dRo47ytazrxf8/ylF+Ht0u2HbXvZkGmBd9rq4KWK5WTb++xu/F9AC8TYOhrQBYdx/AQt79wCT7DiRd+vpjVwA0rZbT88buT9euPTYjbVsbtZXefKfpfoUbZ2eNxmgqAG+zeThQ1lISX6rfMDy52HQnKecno3tXADRBA/5CoiQ82YRn1HP5dbBUan9jUnKJXxv9CnUiAXibL/bkbd7jS3HJ0Z1J495MCPZAkzTgawlfg7zO47tyEfADQS201H5+fv652OI4n5X8FetdAls5NbAGTAG8reqJfFXpjSNtdKANQlmlpWS50BOJmgb1tdtcygiMyebyPF8I8lbZXBo4mU6vag9CmV/T1KmBTAHYlYykbTnMeGxbU2LSPawZsZYZk05Z7d4n+AP1SQL+5W12F0Lwt269VXA02Gnccrk8LPtr9IjhBpoWA2kYOwG+q8pOfFXpfJOf8lggb28ZHMj2N4RmnJ4A2FUyuk8udIgZYT8IV6vrTW8V7KxWrlTwydnZM1OpeFhjpeInaRgVgHf5Ys+tnMf9jStIeY7NDYyAIdFRvs7ja0WN9fgdp/0AulVw4/PtjlO5jK+VilUYPpI6hGHj93YSgHf5Yq9rN28/gCL0tQYCIM+20/P0xyzT6wmdmzdJwO0uN93dfPlyXsfxxpO9vcfSMBKA7WwuB/RkdzZfL9AnSbf+5Q14AkEvNZ0EhI6z88g7rgTs8hoXZRsRqyAB2M4XezzZHdMAQOTyKN+Nf+wLo/zBaDIJmE6ntdxPdUOh+DWW+37mzzSZTuuZRsj7rQTb2FwOqG+OI9mNzdcLdM2ojszFhePDQzdcrZ7XeDzv4sbZWd3d/PLt/v7MJAJfFHmdocjn2lAoFlAB2M7mcsC6+gB8AcZB3+8LudiERz9DjPJHKK4EHNVyOp/jvG5q5G2SioVWA7RBcGvVwvze5r8vdNrAVvBf/7aCNHOJdtazQbuQd/1Hn4u91wvYlCS4emm/SyDAJWVG2dusVquHN//858Yb75RuHGQSgvXAz1QwXr/3/vuBrnIQy0gA0nlS/kCeqjR71RHMlY3Ljb/+TqJRzu8ku3nJE3uvF2iS3gi1rP9ULsr7QC6dElienz8odYCQGX2vlstHtoJ/l5AAZLN5OmARurQk603atdcLFEHAR63WicByOZ84zq3UioDj/GRG/Yu9vb3HbYy+u4AEINvCXHelO3x5e3fAyxbSrdcLbEPAhzXfXLvm7U0m102w/2D9E9pl/9tv/tGPPwYCZJjJuimzM1dep/+sA6+Ri2vbpd35Wr3yhCoV0AlUALJ1cXmdVgD8lMdYDoiu2GzceyJ05wOdw2FA2ZKbmCfd4Ul6AtDF14vx4DAdoEdIAPLZPB2wiFs5j3ft9WK4dJtdXb7qC2vwgd5hCiCfJ91aXqc32auSfrP1hOWAaAbr8YEBIQEopmvL67L6ABTLAVEXyvoARm0h3eqoztuwYtGB18jVz4tufWAk6AEoxpdura+/nvO4L+wHgGK0rK/z+C/ir8zjAyPBFEAxXVxep5tapN2sWQ6INJub8GjQr+XoUwAYsufSrVKt17PXy9XeRVkfwDuYAihOu5496Y47kt2UxXLA8aKsDwA1cqVbo7rjnNfrdeA1ctm5dLrHN5eegHYoAFAAPQDlvJIoEeiKrD4AxXLA4Urm75/FXxnlA0CDdB61SyO/Ozmv92lHXifX7lcg0ftvJiR1AGCdJ90KCnn7ATzoyOvkKn9p9eZricr6rgBAzZgCKK9LZXVtTMyqArAcsD82l+fpV18AAJ2ykPZHhnMp3uF/3NLr5Mq/WJ4HoDUsAyzPF/u77O2yH7v+WjrDuyE5PS9p3qNxD0BrmAIoz0ZZvc4Ob084HbAtnJ4HoLNIAKrRgOpJPZK53yaXdLEc0B5OzwPQC0wBVLPLroBJwPfjy8Yabl/ylwyimuTfkvX4ADACrhRv9Ep2aZtLe81eLAes7wokWp43E6oqAHqMKYDqXsn29dltjPDzuBK9XpTHPD4A4C1z6c4IvwhNAPowwm772txX3xMAAC5xpV8BomvbGHfp8qXc3goAAPSGJ/0Kyk1ebMADABiNZP+CPgXquq5kX/2ZEPABACP0XPoVuHcJ+L5wkA4ApGIfgHHZZf+CrmM9PgAAKVzp10iesj4AADV5Jf0K9JT1AQCoQZ+WA/rS/f0VAADoBU+6G/ADiRKUmRDwAQCoVZeWA+rreCqU9QEAsOK5tBfwfWHXPQAAWmHzdEB23QMAoCNcaXaU/7Uwjw8AQCe9knrL+szjAwDQA7ssB/SFeXwAAHrJE8r6AACMTt5yQF8Y5QMAMEjP5SLgB8IoHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYGf/H20K4x5SdJPJAAAAAElFTkSuQmCC'

function formatDate(dt: Date) {
  return dt.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function headerTemplate() {
  return `<section style="width:100%; font-size:16px; padding:0 0 0 0; display:block; text-align:center; font-family:system-ui;">
 <div style="margin:0 0 6mm 0;">
  <img 
    src="${imageBase64}"
    alt="RED CAT PICTURES Logo"
    style="height:64px; margin-right:14px; display:inline-block; vertical-align:middle;" />
  <span style="font-size:36px; font-weight:500; letter-spacing:0.5px; display:inline-block; vertical-align:middle;">
    RED CAT PICTURES
  </span>
</div>
  <div style="margin-bottom:8px;padding:0 12mm;">
    <span style="font-weight:600;">Registered Address:</span> 
    17, Netaji Subhash Road, Beltala, P.O.- Harinavi SO, P.S.- Sonarpur, District: South 24 Parganas, 
    Pincode: 700148, Ward No. 23
  </div>
  <div style="margin-bottom:6px;">
    Email: <a href="mailto:contact@redcatpictures.com" style="color:#1565C0; text-decoration:underline;">contact@redcatpictures.com</a>
    &nbsp;&nbsp;
    Phone: +918910489578
  </div>
  <div>
    Website: <a href="https://redcatpictures.com" style="color:#1565C0; text-decoration:underline;">https://redcatpictures.com</a>
  </div>
</section>`
}

function footerTemplate() {
  return `
  <section style="position:relative; width:100%; font-size:14px; padding:0 20mm 4mm 20mm; display:flex; justify-content:space-between; align-items:center;">
    <img
      src="${imageBase64}"
      alt="RED CAT PICTURES Logo"
      style="
        position:absolute;
        right:0;
        top:0;
        transform: translateX(15%) translateY(-60%);
        opacity:0.1;
        width:300px;
        pointer-events:none;
        user-select:none;
      "
    />
    <span>
      <span style="font-size:14px; font-weight:bold">Signature: ______________________</span>
    </span>
    <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
    <style>
      @media (min-width: 768px) {
        section > img[alt="RED CAT PICTURES Logo"] {
          left: -104px;
          transform: translateY(-37%);
          width: 560px;
        }
      }
    </style>
  </section>`
}

function wrapHtml(html: string, title: string) {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
      @page { margin: 12mm 18mm 28mm 18mm; size: A4; }
      body { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 14px; color: #222; }
      table { border-collapse: collapse; width: 100%; margin: 2em 0; }
      th, td { border: 1px solid #bbb; padding: 7px 10px; }
      th { background: #f3f3f3; }
      h1, h2, h3, h4, h5, h6 {
        text-align: center;
        margin: auto;
        margin-top: 1.2em;
      }
      h4 {
        text-align: left;
      }
      .page-break { page-break-before: always; break-before: page; }
      table:last-of-type {
        border-collapse: separate;
        border-spacing: 0 22px;
        width: 100%;
      }
      table:last-of-type th,
      table:last-of-type td {
        width: 50%;
        border: none !important;
        padding: 9px 10px;
        font-size: 15px;
        text-align: left;
      }
    </style>
  </head>
  <body>
    ${headerTemplate()}
    ${html}
  </body>
  </html>`
}

const terms = `
**Last Updated:** Sept 26, 2025

#### 1. Introduction

By using our photography/videography services (“Services”), you agree to comply with these Terms & Conditions (“Terms”), including our Privacy Policy.
If you disagree with any provision herein, discontinue use of our Services immediately.

#### 2. Service Scope & Delivery

* **Delivery Timeline:**
  Photographs and videos will be delivered within 10–20 days from the shoot date.
  Delivery commences only after the second instalment is received.

* **Deliverables Release:**
  Deliverables are only released post second instalment.

* **Data Liability:**
  RED CAT PICTURES is not liable for data loss after one month from the shoot date.
  Clients are advised to provide a hard drive on the shoot day for immediate backup.

* **Digital Delivery:**
  All deliverables will be provided via our secure RED CAT Drive and remain accessible for 30 days from the date of delivery.
  For any storage holding beyond 30 days, additional charges will apply.

* **Project Scope Changes:**
  Any modification, substitution, or update to the originally quoted deliverables, services, or shoot specifications after quotation approval will require a revised quotation, with corresponding adjustments to project timeline and budget.
  The shoot or production will be held until such changes are documented and mutually agreed, and any additional costs or delays arising therefrom will be borne by the client.

#### 3. Shoot Arrangements & Supervision

* **Client Presence:**
  A Client/Agency representative must be present during the shoot.
  No changes or objections are entertained post-shoot.

* **Editing Revisions:**
  One round of editing revisions is included in the package.
  Any further requests for edits or modifications will be subject to additional charges.

* **Reshoot Policy:**
  All reshoot requests, regardless of the reason, will incur separate charges as per RED CAT PICTURES’ current rates.
  No complimentary reshoots are provided.

* **Creative Supervision:**
  Interference in the creative process may impact the outcome;
  RED CAT PICTURES shall not be held liable for artistic dissatisfaction.

#### 4. Payment Terms

* **Structure:**

  * 20% advance payment at booking confirmation (shoot finalization).
  * 70% due post shoot completion.
  * Advance payment must be completed at least 1 day prior to the scheduled shoot date.
  * Remaining 10% upon delivery of final materials.

* **Banking Policy:**
  All transactions must be conducted via bank transfer (NEFT/IMPS/RTGS/UPI).
  No cash payments are accepted.

* **Clearances:**
  Payment clearance is required prior to any corrections or changes in final deliverables.

* **Travel & Accommodation:**
  Charges, if applicable, must be paid in advance.

* **Invoice Disputes:**
  Any dispute with invoices must be raised within 7 days of issue.

* **Due Date:**
  All dues must be cleared within 7 days of final delivery; failure may put invoice and deliverables on hold.

#### 5. Cancellations & Postponements

* **Advance Payment:**
  Non-refundable in case of cancellation or postponement initiated by the Client/Agency.

* **Shoot Date Changes:**
  Date can be rescheduled only once within 29 days of advance payment.
  Failure to book a date in this window results in cancellation.

#### 6. Pricing & Adjustments

* **Budget:**
  Once the project is finalized with advance payment, budget is non-negotiable by the client.

* **Large Scale Projects:**
  For multi-individual projects, budget may increase to meet desired outcomes.

* **Fee Variance:**
  RED CAT PICTURES reserves the right to reasonably adjust fee structures; taxes and applicable conversions extra.

#### 7. Copyrights & Usage

* **Copyright Law Compliance:**
  In accordance with the Copyright Act, 1957, RED CAT PICTURES retains original rights to all images and videos produced.

* **License Grant:**
  The client receives a lifetime usage license for delivered materials.

* **Promotional Use:**
  RED CAT PICTURES reserves the right to use the end client’s brand name and logo, as well as final materials, for promotional purposes—including display on our website, social media, blogs, and marketing platforms—unless a separate written agreement states otherwise.

* **Content Ownership:**
  Clients may not reverse engineer or misuse any platform/IP belonging to RED CAT PICTURES.

#### 8. Travel & Logistics

* **Arrangements:**
  The client is responsible for arranging necessary travel, accommodation, and meals for the production team.

* **Team Welfare:**
  The production team is entitled to regular meal breaks during production hours.

***

#### 9. Payments

All payments and transactions must be conducted via banking channels only; cash payments are not accepted.

#### 10. Behaviour & Termination

* **Conduct:**
  Misconduct or inappropriate behaviour towards RED CAT PICTURES personnel is grounds for immediate termination of services without liability or refund.

#### 11. Indemnification

Clients indemnify and hold RED CAT PICTURES harmless from any claims, costs, or losses arising from use, misuse, or breach of these Terms.

#### 12. Governing Law

These Terms are governed by the laws of India.
Jurisdiction for disputes lies exclusively with the courts in Kolkata.

#### 13. Changes To Terms

RED CAT PICTURES may modify these Terms at any time.
Continued use of Services after modifications constitutes acceptance of the revised Terms.

#### 14. MSME Registration

“RED CAT PICTURES” is a registered MSME (Micro, Small and Medium Enterprise) under the laws of India.
`

export async function notionPageToPDF({
  tableMarkdown,
  projectDetails,
  clientDetails,
}: {
  tableMarkdown: string
  clientDetails: {
    clientName: string
    clientAddress: string
    clientPhone: string
    clientEmail: string
  }
  projectDetails: {
    quoteNumber: string
    quoteDate: string
    quoteExpiry: string
    shootDate: string
    shootLocation: string
  }
}) {
  const mdContent = `
## Photography & Videography Quotation

**Client Name:** ${clientDetails.clientName}  
**Client Address:** ${clientDetails.clientAddress}  
**Client Phone No:** ${clientDetails.clientPhone.toString()}  
**Client Email:** [${clientDetails.clientEmail}](mailto:${clientDetails.clientEmail})

**Quote Number:** ${projectDetails.quoteNumber}  
**Quote Date:** ${projectDetails.quoteDate}  
**Quote Expiry:** ${projectDetails.quoteExpiry}

**Shoot Date:** ${projectDetails.shootDate}  
**Shoot Location:** ${projectDetails.shootLocation}

## Scope of Work
${tableMarkdown}

***

## Terms & Conditions
${terms}

***

## Acceptance of Quotation

I, _________________, accept the quotation and agree to the terms and conditions stated above.

| For RED CAT PICTURES    | For Client              |
| ------------------------| ----------------------- |
| Signature:              | Signature:              |
| Name:                   | Name:                   |
| Date:                   | Date:                   |
| Place:                  | Place:                  |


_N.B: This Letter consists of 5 pages including this one. Please sign on all pages._
`
  // Markdown → HTML
  const html = md.render(mdContent)
  const pageHtml = wrapHtml(html.replace(/\n<hr>\n/g, '<div class="page-break"></div>'), 'Quotation')

  // HTML → PDF with Puppeteer
  const browser = await puppeteer.launch(
    import.meta.env.NODE_ENV === 'production'
      ? {
          browserWSEndpoint: import.meta.env.BROWSER_ENDPOINT,
          args: ['--no-sandbox', '--disable-dev-shm-usage'],
        }
      : {
          headless: true,
        }
  )
  try {
    const page = await browser.newPage()
    await page.setContent(pageHtml, { waitUntil: 'networkidle0' })
    await page.pdf({
      path: `./${projectDetails.quoteNumber}.pdf`,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `<div></div>`, // headerTemplate()
      footerTemplate: footerTemplate(),
      margin: { top: '28mm', right: '15mm', bottom: '28mm', left: '15mm' },
    })
  } finally {
    await browser.close()
  }
}

export default defineTask({
  meta: {
    name: 'workflow:quoation',
    description: 'Sync Notion Resources into cache',
  },
  async run() {
    const config = useRuntimeConfig()
    const notionDbId = config.private.notionDbId as unknown as NotionDB
    const projects = await notionQueryDb<NotionProject>(notion, notionDbId.project)

    const project = projects.find((project) => project.properties.Slug.formula.string === 'devotional-music-video-49')
    if (!project) return { result: null }

    const client = (await notion.pages.retrieve({ page_id: project.properties.Client.relation[0].id })) as unknown as NotionProjectClient

    n2m = n2m ?? new NotionToMarkdown({ notionClient: notion })
    const markdown = await convertNotionPageToMarkdown(n2m, project.id, true)
    const tableMarkdown = markdown.split('\n---\n')[0]

    const today = new Date()
    const expiry = new Date(today)
    expiry.setDate(expiry.getDate() + 29)

    await notionPageToPDF({
      tableMarkdown,
      clientDetails: {
        clientName: notionTextStringify(client.properties.Name.title),
        clientAddress: '117, Rumjhum Park Atghara P.O dhalua Kolkata - 700152', //JSON.stringify(client.properties.Place),
        clientPhone: client.properties.Phone.phone_number,
        clientEmail: client.properties.Email.email,
      },
      projectDetails: {
        quoteNumber: `RCP-Q-${project.properties.Index.number}-1`,
        quoteDate: formatDate(today),
        quoteExpiry: formatDate(expiry),
        shootDate: project.properties.Date.date.start,
        shootLocation: '117, Rumjhum Park Atghara P.O dhalua Kolkata - 700152',
      },
    })

    return { result: 'success' }
  },
})
