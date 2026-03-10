import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default [
    {
        input: 'src/index.ts',
        output: [
            { file: 'dist/index.cjs.js', format: 'cjs' },
            { file: 'dist/index.esm.js', format: 'esm' }
        ],
        plugins: [resolve(), commonjs(), typescript()]
    },
    {
        input: 'src/cli.ts',
        output: { file: 'dist/cli.js', format: 'cjs', banner: '#!/usr/bin/env node' },
        plugins: [resolve(), commonjs(), typescript()]
    }
];