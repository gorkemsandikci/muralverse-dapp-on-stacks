# Urban Canvas: Community Street Art Revival - Frontend

This is the frontend application for the **Urban Canvas: Community Street Art Revival** campaign, built with [Next.js](https://nextjs.org) and customized with a vibrant street art aesthetic.

## 🎨 Project Overview

A community-driven fundraising platform that transforms urban spaces through street art murals. Built on Stacks blockchain with an immersive street art user experience.

### 🌟 Features
- **Street Art Theme**: Vibrant colors, graffiti typography, urban textures
- **Artist Voting System**: Community-driven mural design selection
- **Interactive Progress**: Paint can filling animation with street art colors
- **Funding Breakdown**: Visual representation of fund allocation
- **Project Timeline**: 12-week roadmap with milestones
- **Mobile Responsive**: Touch-optimized for all devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Hiro Platform API key

### Development Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
```

Add your Hiro Platform API key:
```bash
NEXT_PUBLIC_PLATFORM_HIRO_API_KEY=your-api-key-here
```

3. **Start Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your street art fundraising platform.

## 🎨 Customization

### Theme Configuration
Edit `src/theme.ts` to customize:
- Street art color palette
- Custom fonts (Permanent Marker, Creepster)
- Button variants and hover effects
- Progress bar styling

### Campaign Settings
Update `src/constants/campaign.ts` for:
- Campaign title and description
- Funding goal and duration
- Theme colors and styling
- Campaign milestones and features

### Campaign Content
Modify `public/campaign-details.md` with:
- Project overview and mission
- Funding breakdown details
- Timeline and milestones
- Team information

### Visual Assets
Add images to `public/campaign/`:
- Artist portfolio images
- Mural design concepts
- Community photos
- Urban texture backgrounds

## 🏗️ Project Structure

```
front-end/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   │   ├── CampaignDetails.tsx    # Main campaign page
│   │   ├── DonationModal.tsx      # Donation interface
│   │   ├── ArtistVotingWidget.tsx # Artist voting system
│   │   └── ui/             # UI components
│   ├── constants/           # Campaign configuration
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── theme.ts             # Chakra UI theme
├── public/                  # Static assets
│   ├── campaign/            # Campaign images
│   └── campaign-details.md  # Campaign content
└── package.json             # Dependencies
```

## 🎨 Street Art Theme

### Color Palette
- **Primary**: Electric Blue (#00D4FF)
- **Secondary**: Vibrant Orange (#FF6B35)
- **Accent**: Neon Green (#39FF14)
- **Dark Accent**: Deep Purple (#6A0DAD)

### Typography
- **Headings**: Permanent Marker (graffiti style)
- **Body**: Inter (clean, readable)
- **Accent**: Creepster (urban edge)

### Animations
- Paint drip effects
- Spray paint animations
- Neon glow transitions
- Hover lift effects

## 📱 User Experience

### Mobile First Design
- Responsive grid layouts
- Thumb-friendly interactions
- Touch-optimized buttons
- Adaptive typography

### Accessibility
- High contrast ratios
- Screen reader support
- Keyboard navigation
- Reduced motion options

### Performance
- Optimized image loading
- Efficient animations
- Fast page transitions
- Progressive enhancement

## 🔧 Technical Details

### Framework
- **Next.js 15.1.7**: React framework with app router
- **TypeScript**: Type-safe development
- **Chakra UI**: Component library with custom theme

### Styling
- **CSS-in-JS**: Chakra UI styling system
- **Custom Theme**: Street art color palette
- **Responsive Design**: Mobile-first approach
- **Animations**: CSS transitions and transforms

### State Management
- **React Hooks**: useState, useEffect, useContext
- **Custom Hooks**: Campaign queries, blockchain integration
- **Context API**: Wallet and theme providers

## 🧪 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Quality
- **ESLint**: Code linting and formatting
- **TypeScript**: Type checking and validation
- **Prettier**: Code formatting (if configured)

### Testing
- Test components in development
- Verify blockchain integration
- Check mobile responsiveness
- Validate accessibility

## 🚀 Deployment

### Build Process
```bash
npm run build
```

### Production
- Optimized bundle
- Static asset optimization
- Performance monitoring
- Error tracking

### Environment Variables
- `NEXT_PUBLIC_PLATFORM_HIRO_API_KEY`: Hiro Platform API key
- `NEXT_PUBLIC_CONTRACT_ADDRESS`: Smart contract address
- `NEXT_PUBLIC_NETWORK`: Blockchain network (devnet/testnet/mainnet)

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Maintain street art aesthetic consistency
- Ensure mobile responsiveness
- Include accessibility features

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Chakra UI Documentation](https://chakra-ui.com/)
- [Stacks Documentation](https://docs.stacks.co/)

### Community
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Chakra UI GitHub](https://github.com/chakra-ui/chakra-ui)
- [Stacks Discord](https://discord.gg/stacks)

## 📄 License

This project is licensed under the MIT License.

---

**Urban Canvas: Community Street Art Revival** - Frontend Development 🎨✨

*Built with Next.js and Chakra UI on Stacks blockchain*
